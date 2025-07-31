import React, { useState, useEffect } from "react";
import { DatePicker, InputNumber, Button, Select, Alert } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { convertDDMMYYYYStrToYYYYMMDDStr } from "./dateUtils";

const CustomStageEditor = ({
                               startDate,
                               cigsPerDay,
                               customStages,
                               setCustomStages,
                               planLog = []
                           }) => {
    const [intervalType, setIntervalType] = useState("week"); // 'day' or 'week'
    const [validationError, setValidationError] = useState("");


    useEffect(() => {
        if (customStages.length <= 1 && planLog.length > 0) {
            const stagesFromPlan = planLog.map(stage => ({
                date: dayjs(stage.date).format("YYYY-MM-DD"),
                cigs: stage.cigs
            }));
            setCustomStages(stagesFromPlan);
        }
    }, [planLog, customStages.length, setCustomStages]);

    const updateStageDate = (idx, date) => {
        const clone = [...customStages];
        clone[idx].date = date;
        setCustomStages(clone);
    };

    const updateStageCigs = (idx, cigs) => {
        const clone = [...customStages];
        clone[idx].cigs = cigs;
        setCustomStages(clone);
    };

    const addNewStage = () => {
        const last = customStages[customStages.length - 1];
        const nextDate = dayjs(last.date)
            .add(intervalType === "week" ? 7 : 1, "day")
            .format("YYYY-MM-DD");

        if (customStages.some((stage) => stage.date === nextDate)) {
            setValidationError("Ngày mới đã tồn tại trong danh sách giai đoạn.");
            return;
        }

        setCustomStages([
            ...customStages,
            {
                date: nextDate,
                cigs: Math.max(last.cigs - 2, 0)
            }
        ]);
        setValidationError("");
    };

    const removeStage = (idx) => {
        if (idx === 0) return;
        const clone = [...customStages];
        clone.splice(idx, 1);
        setCustomStages(clone);
        setValidationError("");
    };

    const hasDuplicateDates = customStages.some((stage, idx, arr) =>
        arr.findIndex(s => s.date === stage.date) !== idx
    );

    return (
        <div className="flex flex-col gap-4 mt-4 bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
            <p className="text-lg font-semibold text-gray-800">Tùy chỉnh từng giai đoạn:</p>

            <p className="text-sm text-gray-600 leading-relaxed">
                Bạn có thể điều chỉnh kế hoạch cai thuốc theo từng giai đoạn cụ thể thay vì giảm đều mỗi ngày hoặc mỗi tuần.
                Hãy chọn khoảng thời gian phù hợp mà bạn muốn thêm giai đoạn mới, ví dụ như mỗi tuần hoặc mỗi ngày.
                Sau đó, bạn có thể tự đặt số điếu thuốc tương ứng cho từng thời điểm để phù hợp với thói quen và khả năng của bản thân.
            </p>

            <div className="flex items-center gap-3">
                <span className="text-gray-600">Khoảng thời gian thêm mới:</span>
                <Select
                    value={intervalType}
                    onChange={(val) => setIntervalType(val)}
                    options={[
                        { label: "Hàng ngày", value: "day" },
                        { label: "Hàng tuần", value: "week" }
                    ]}
                    style={{ width: 150 }}
                />
            </div>

            {validationError && <Alert message={validationError} type="error" showIcon />}
            {hasDuplicateDates && (
                <Alert
                    message="Có ngày bị trùng trong danh sách giai đoạn. Hãy đảm bảo mỗi ngày chỉ xuất hiện một lần."
                    type="warning"
                    showIcon
                />
            )}

            <div className="flex flex-col gap-3">
                {customStages.map((stage, idx) => (
                    <div
                        key={idx}
                        className="flex flex-wrap gap-3 items-center border border-gray-300 bg-gray-50 p-3 rounded-lg"
                    >
                        <span className="text-gray-700 font-medium">Giai đoạn {idx + 1}</span>
                        <DatePicker
                            format="DD-MM-YYYY"
                            value={dayjs(stage.date)}
                            onChange={(date, dateStr) =>
                                updateStageDate(idx, convertDDMMYYYYStrToYYYYMMDDStr(dateStr))
                            }
                            className="w-[160px]"
                        />
                        <InputNumber
                            min={0}
                            value={stage.cigs}
                            onChange={(value) => updateStageCigs(idx, value)}
                            className="w-[100px]"
                        />
                        <span className="text-gray-600">điếu/ngày</span>
                        <Button
                            onClick={() => removeStage(idx)}
                            disabled={idx === 0}
                            danger
                            icon={<DeleteOutlined />}
                        >
                            Xoá
                        </Button>
                    </div>
                ))}
            </div>

            <Button onClick={addNewStage} type="primary" ghost icon={<PlusOutlined />}>+
                Thêm giai đoạn mới
            </Button>
        </div>
    );
};

export default CustomStageEditor;
