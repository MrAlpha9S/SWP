import React, {useState, useEffect} from "react";
import {DatePicker, InputNumber, Button, Alert, Collapse, Popconfirm, Popover} from "antd";
import {PlusOutlined, DeleteOutlined} from "@ant-design/icons";
import dayjs from "dayjs";
import {convertYYYYMMDDStrToDDMMYYYYStr} from "./dateUtils";
import {IoWarningOutline} from "react-icons/io5";
import {IoMdAddCircleOutline, IoMdRemoveCircleOutline} from "react-icons/io";
import {useNotificationManager} from "../hooks/useNotificationManager.jsx";
import {useValidationErrorStore} from "../../stores/store.js";

const {RangePicker} = DatePicker;
const {Panel} = Collapse;

const CustomStageEditor = ({customPlanWithStages, setCustomPlanWithStages, cigsPerDay}) => {
    const {openNotification} = useNotificationManager()
    const [currentId, setCurrentId] = useState(0);
    const {validationError, setValidationError} = useValidationErrorStore();

    // Initialize currentId based on existing stages
    useEffect(() => {
        if (customPlanWithStages && customPlanWithStages?.length > 0) {
            const maxId = Math.max(...customPlanWithStages.map(stage => stage.id || 0));
            setCurrentId(maxId + 1);
        }
    }, []);

    const updateStageDate = (stageIndex, startDate, endDate, stageId) => {
        const updatedStages = [...customPlanWithStages];
        const start = startDate.add(7, "hours").toDate();
        const end = endDate.add(7, "hours").toDate();

        updatedStages[stageIndex].startDate = start.toISOString();
        updatedStages[stageIndex].endDate = end.toISOString();

        const logs = [];
        const currentDate = new Date(start);

        let index = 0
        while (currentDate <= end) {
            logs.push({
                date: currentDate.toISOString(),
                cigs: stageIndex === 0 && stageId === 0 && index++ === 0 ? cigsPerDay : 0,
                status: '',
                stageId: stageId,
            });
            currentDate.setUTCDate(currentDate.getUTCDate() + 1);
        }

        updatedStages[stageIndex].logs = logs;
        setCustomPlanWithStages(updatedStages);
    };

    const validateLogs = () => {
        let lastCigs = cigsPerDay
        const updatedStages = customPlanWithStages?.map((stage) => {
            const updatedLogs = stage.logs.map((log, index, logsArray) => {
                if (index === 0 && log.cigs > lastCigs) return {...log, status: 'warning'};
                if (index === 0) {
                    lastCigs = log.cigs
                    return {...log, status: ''}
                }

                const prevCigs = logsArray[index - 1].cigs;
                const isError = log.cigs > prevCigs;

                lastCigs = log.cigs
                return {
                    ...log,
                    status: isError ? 'warning' : '',
                };
            });

            return {
                ...stage,
                logs: updatedLogs,
            };
        });

        setCustomPlanWithStages(updatedStages);
    };

    const updateStageCigs = (stageIndex, logIndex, cigs) => {
        const updatedStages = [...customPlanWithStages];

        if (
            updatedStages[stageIndex] &&
            updatedStages[stageIndex].logs &&
            updatedStages[stageIndex].logs[logIndex]
        ) {
            updatedStages[stageIndex].logs[logIndex].cigs = cigs;
            setCustomPlanWithStages(updatedStages);
        } else {
            setValidationError("Invalid stageIndex or logIndex in updateStageCigs");
        }
        validateLogs()
    };

    const addNewStage = () => {
        if (customPlanWithStages?.length > 0 && customPlanWithStages[customPlanWithStages?.length - 1].startDate === "") {
            setValidationError('Hãy điền ngày bắt đầu, ngày kết thúc ở Giai đoạn trước.')
            return
        }
        setValidationError('')
        setCustomPlanWithStages([
            ...customPlanWithStages,
            {
                id: currentId,
                startDate: "",
                endDate: "",
                logs: [],
            },
        ]);
        setCurrentId((prev) => prev + 1);
        setValidationError("");
    };

    const removeStage = (index) => {
        if (index === 0) return;
        const clone = [...customPlanWithStages];
        const deleted = clone.splice(index, 1);
        setCustomPlanWithStages(deleted);
        setValidationError("");
    };

    const getMinDateForStage = (stageIndex) => {
        if (stageIndex === 0) {
            return dayjs();
        }
        const previousStage = customPlanWithStages[stageIndex - 1];
        if (previousStage?.endDate) {
            return dayjs(previousStage.endDate).add(1, 'day');
        }
        return dayjs();
    };

    const getMaxDateForStage = (stageIndex) => {
        if (customPlanWithStages?.length <= 1) return
        const nextStage = customPlanWithStages[stageIndex + 1];
        if (nextStage?.startDate) {
            return dayjs(nextStage.startDate).add(-1, 'day');
        }
    }

    const getRangePickerValue = (stage) => {
        if (stage.startDate && stage.endDate) {
            return [
                dayjs(stage.startDate),
                dayjs(stage.endDate)
            ];
        }
        return null;
    };

    useEffect(() => {
        if (customPlanWithStages?.length > 0) {
            validateLogs();
            console.log(customPlanWithStages);
        }
    }, [customPlanWithStages?.length]);

    const addDay = (stageId) => {
        const index = customPlanWithStages.findIndex((stage) => stage.id === stageId);

        if (customPlanWithStages[index + 1]) {
            const currentStageEndDate = new Date(customPlanWithStages[index].endDate);
            const nextDayAfterCurrentEnd = new Date(currentStageEndDate);
            nextDayAfterCurrentEnd.setUTCDate(nextDayAfterCurrentEnd.getUTCDate() + 1);

            const nextStageStartDate = new Date(customPlanWithStages[index + 1].startDate);

            if (nextDayAfterCurrentEnd.toISOString() === nextStageStartDate.toISOString()) {
                openNotification('failed', {
                    message: 'Không thể thêm ngày',
                    content: 'Ngày kết thúc của giai đoạn trước không được trùng với ngày bắt đầu của giai đoạn tiếp theo.'
                })
                return;
            }
        }

        const customStageClone = [...customPlanWithStages];
        const currentStage = customStageClone.find((stage) => stage.id === stageId);

        const lastLog = currentStage.logs[currentStage.logs?.length - 1];
        const nextLogDate = new Date(lastLog.date);
        nextLogDate.setUTCDate(nextLogDate.getUTCDate() + 1);

        currentStage.logs.push({
            date: nextLogDate.toISOString(),
            cigs: 0,
            status: '',
            stageId: stageId,
        });

        const newEndDate = new Date(currentStage.endDate);
        newEndDate.setUTCDate(newEndDate.getUTCDate() + 1);
        currentStage.endDate = newEndDate.toISOString();

        setCustomPlanWithStages(customStageClone);
    };

    const removeDay = (stageId) => {
        const customStageClone = [...customPlanWithStages];
        const currentStage = customStageClone.find((stage) => stage.id === stageId);
        if (currentStage.logs?.length === 1) {
            return
        }
        const lastDateOfCurrentStageObj = new Date(currentStage.logs[currentStage.logs.length - 1].date)
        if (!lastDateOfCurrentStageObj) {
            return;
        }
        lastDateOfCurrentStageObj.setDate(lastDateOfCurrentStageObj.getDate() + 1)
        currentStage.logs.pop()
        const currentStageEndDateObj = new Date(currentStage.endDate)
        currentStageEndDateObj.setUTCDate(currentStageEndDateObj.getUTCDate() - 1)
        currentStage.endDate = currentStageEndDateObj.toISOString();
        setCustomPlanWithStages(customStageClone);
    }

    return (
        <div className="flex flex-col gap-4 mt-4 bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
            <p className="text-lg font-semibold text-gray-800">Tùy chỉnh từng giai đoạn:</p>

            <p className="text-sm text-gray-600 leading-relaxed">
                Bạn có thể điều chỉnh kế hoạch cai thuốc theo từng giai đoạn cụ thể thay vì giảm đều mỗi ngày hoặc mỗi
                tuần.
                Hãy chọn khoảng thời gian phù hợp mà bạn muốn thêm giai đoạn mới, ví dụ như mỗi tuần hoặc mỗi ngày. Sau
                đó, bạn
                có thể tự đặt số điếu thuốc tương ứng cho từng thời điểm để phù hợp với thói quen và khả năng của bản
                thân.
            </p>

            {validationError && <Alert message={validationError} type="error" showIcon/>}

            <Collapse
                className='flex flex-col justify-center'>
                {customPlanWithStages && customPlanWithStages.map((stage, stageIndex) => (
                    <Panel
                        key={stage.id}
                        header={
                            <span className="text-white font-medium">
                                Giai đoạn {stageIndex + 1}
                                {stage.startDate && stage.endDate && (
                                    <>
                                        {" – "}
                                        {dayjs(stage.startDate).format("YYYY-MM-DD")} → {dayjs(stage.endDate).format("YYYY-MM-DD")}
                                    </>
                                )}
                            </span>
                        }
                    >
                        <div className="flex flex-col gap-4 w-full">
                            <div className="flex flex-wrap gap-3 items-center">
                                <span className="text-gray-700 font-medium">Chọn ngày:</span>
                                <RangePicker
                                    format={'DD-MM-YYYY'}
                                    key={`range-picker-${stage.id}`}
                                    value={getRangePickerValue(stage)}
                                    minDate={getMinDateForStage(stageIndex)}
                                    maxDate={getMaxDateForStage(stageIndex)}
                                    onChange={(e) => updateStageDate(stageIndex, e[0], e[1], stage.id)}
                                    className="w-full sm:w-auto"
                                />
                                <Popover title='Thêm 1 ngày'>
                                    <Button onClick={() => addDay(stage.id)}><IoMdAddCircleOutline/></Button>
                                </Popover>
                                <Popover title='Xóa 1 ngày'>
                                    <Button onClick={() => removeDay(stage.id)}><IoMdRemoveCircleOutline/></Button>
                                </Popover>
                                <Popconfirm
                                    title="Xóa giai đoạn"
                                    description="Bạn có chắc muốn xóa giai đoạn này?"
                                    onConfirm={() => removeStage(stageIndex)}
                                    okText="Có"
                                    cancelText="Không"
                                >
                                    <Button
                                        disabled={customPlanWithStages.length === 1 || stageIndex === 0}
                                        danger
                                        icon={<DeleteOutlined/>}
                                    >
                                        Xóa
                                    </Button>
                                </Popconfirm>
                            </div>

                            <div className="flex flex-col gap-2 w-full">
                                {stage.logs?.length > 0 &&
                                    stage.logs.map((log, logIndex) => (
                                        <div
                                            className="flex flex-wrap gap-4 items-center border border-gray-200 bg-white p-3 rounded"
                                            key={`${stage.id}-log-${logIndex}`}
                                        >
                                            <p className="w-40">
                                                Ngày: {convertYYYYMMDDStrToDDMMYYYYStr(log?.date?.split("T")[0])}
                                            </p>
                                            <span>Số điếu:</span>
                                            <InputNumber
                                                min={0}
                                                max={cigsPerDay}
                                                value={log.cigs}
                                                onChange={(value) => updateStageCigs(stageIndex, logIndex, value)}
                                                className="w-[100px]"
                                                status={log.status}
                                            />
                                            <span className="text-gray-600">điếu/ngày</span>
                                            {log.status === "warning" && (
                                                <span className="text-warning-500 flex items-center gap-2">
                                                    <IoWarningOutline/>
                                                    <span>Số điếu hôm trước đang thấp hơn số điếu hiện tại.</span>
                                                </span>
                                            )}
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </Panel>
                ))}
            </Collapse>

            <Button onClick={addNewStage} type="primary" ghost icon={<PlusOutlined/>}>
                Thêm giai đoạn mới
            </Button>
        </div>
    );
};

export default CustomStageEditor;