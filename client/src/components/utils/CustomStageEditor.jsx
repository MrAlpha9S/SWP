import React, {useState, useEffect} from "react";
import {DatePicker, InputNumber, Button, Alert, Collapse, Popconfirm} from "antd";
import {PlusOutlined, DeleteOutlined} from "@ant-design/icons";
import dayjs from "dayjs";
import {convertYYYYMMDDStrToDDMMYYYYStr} from "./dateUtils";
import {IoWarningOutline} from "react-icons/io5";

const {RangePicker} = DatePicker;
const {Panel} = Collapse;

const CustomStageEditor = ({planLog = [], cigsPerDay}) => {
    const [validationError, setValidationError] = useState("");
    const [customStages, setCustomStages] = useState([]);
    const [currentId, setCurrentId] = useState(0);

    useEffect(() => {
        if (customStages.length === 0 && planLog.length > 0) {
            const stagesFromPlan = planLog.map((stage) => ({
                date: dayjs(stage.date).format("YYYY-MM-DD"),
                cigs: stage.cigs,
            }));
            setCustomStages(stagesFromPlan);
        }
    }, [planLog]);

    const updateStageDate = (stageIndex, startDate, endDate) => {
        const updatedStages = [...customStages];
        const start = startDate.add(7, "hours").toDate();
        const end = endDate.add(7, "hours").toDate();

        updatedStages[stageIndex].startDate = start.toISOString();
        updatedStages[stageIndex].endDate = end.toISOString();

        const logs = [];
        const currentDate = new Date(start);

        while (currentDate <= end) {
            logs.push({
                date: currentDate.toISOString(),
                cigs: 0,
                status: ''
            });
            currentDate.setUTCDate(currentDate.getUTCDate() + 1);
        }

        updatedStages[stageIndex].logs = logs;
        setCustomStages(updatedStages);
    };

    const validateLogs = () => {
        let lastCigs = cigsPerDay
        const updatedStages = customStages.map((stage) => {
            const updatedLogs = stage.logs.map((log, index, logsArray) => {
                if (index === 0 && log.cigs > lastCigs) return {...log, status: 'warning'};
                if (index === 0) return {...log, status: ''};

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

        setCustomStages(updatedStages);
    };

    const updateStageCigs = (stageIndex, logIndex, cigs) => {
        const updatedStages = [...customStages];

        if (
            updatedStages[stageIndex] &&
            updatedStages[stageIndex].logs &&
            updatedStages[stageIndex].logs[logIndex]
        ) {
            updatedStages[stageIndex].logs[logIndex].cigs = cigs;
            setCustomStages(updatedStages);
        } else {
            setValidationError("Invalid stageIndex or logIndex in updateStageCigs");
        }
        validateLogs()
        console.log(customStages)
    };

    const addNewStage = () => {
        if (customStages.length > 0 && customStages[customStages.length - 1].startDate === "") {
            setValidationError('Hãy điền ngày bắt đầu, ngày kết thúc ở Giai đoạn trước.')
            return
        }
        setValidationError('')
        setCustomStages([
            ...customStages,
            {
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
        const clone = [...customStages];
        clone.splice(index, 1);
        setCustomStages(clone);
        setValidationError("");
    };



    useEffect(() => {
        if (customStages.length > 0) {
            validateLogs();
            console.log(customStages);
        }
    }, [customStages.length]);

    const lastStageEndDate = customStages[customStages.length - 2]?.endDate;
    const minDate = customStages.length === 1 ? dayjs() : dayjs(lastStageEndDate).add(1, 'day');

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
                {customStages.map((stage, stageIndex) => (
                    <Panel
                        key={stageIndex}
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
                                    minDate={minDate}
                                    onChange={(e) => updateStageDate(stageIndex, e[0], e[1])}
                                    className="w-full sm:w-auto"
                                />
                                <Popconfirm
                                    title="Xóa giai đoạn"
                                    description="Bạn có chắc muốn xóa giai đoạn này?"
                                    onConfirm={() => removeStage(stageIndex)}
                                    okText="Có"
                                    cancelText="Không"
                                >
                                <Button
                                    disabled={customStages.length === 0}
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
                                            key={logIndex}
                                        >
                                            <p className="w-40">
                                                Ngày: {convertYYYYMMDDStrToDDMMYYYYStr(log.date.split("T")[0])}
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