import React from 'react';
import dayjs from 'dayjs';

const PlanSummaryReport = ({ customPlanWithStages, cigsPerDay }) => {
    if (!customPlanWithStages || customPlanWithStages.length === 0) {
        return (
            <div className="mt-4">
                <p className="text-gray-600">Chưa có dữ liệu kế hoạch để hiển thị.</p>
            </div>
        );
    }

    // Calculate statistics
    const totalStages = customPlanWithStages.length;

    // Get all logs from all stages
    const allLogs = customPlanWithStages.flatMap(stage => stage.logs).filter(log => log && log.date);

    if (allLogs.length === 0) {
        return (
            <div className="mt-4">
                <p className="text-gray-600">Chưa có dữ liệu chi tiết để hiển thị.</p>
            </div>
        );
    }

    // Sort logs by date
    const sortedLogs = allLogs.sort((a, b) => new Date(a.date) - new Date(b.date));

    const startDate = sortedLogs[0]?.date;
    const endDate = sortedLogs[sortedLogs.length - 1]?.date;
    const totalDays = startDate && endDate ? dayjs(endDate).diff(dayjs(startDate), 'day') + 1 : 0;

    const startingCigs = cigsPerDay || sortedLogs[0]?.cigs || 0;
    const endingCigs = sortedLogs[sortedLogs.length - 1]?.cigs || 0;
    const totalReduction = startingCigs - endingCigs;
    const reductionPercentage = startingCigs > 0 ? ((totalReduction / startingCigs) * 100).toFixed(1) : 0;

    // Count warnings/errors
    const warningsCount = allLogs.filter(log => log.status === 'warning' || log.status === 'error').length;

    return (
        <div className="mt-6">

            <div className="leading-relaxed">
                <p className="mb-4">
                    Dựa trên thông tin bạn đã nhập, kế hoạch cai thuốc của bạn gồm <strong>{totalStages} giai đoạn</strong>
                    {totalDays > 0 && (
                        <>, kéo dài <strong>{totalDays} ngày</strong></>
                    )}
                    {startDate && endDate && (
                        <>, từ <strong>{dayjs(startDate).format('DD-MM-YYYY')}</strong> đến <strong>{dayjs(endDate).format('DD-MM-YYYY')}</strong></>
                    )}
                    . Bạn sẽ giảm từ <strong>{startingCigs} điếu/ngày</strong> xuống còn <strong>{endingCigs} điếu/ngày</strong>,
                    tổng cộng giảm <strong>{totalReduction} điếu ({reductionPercentage}%)</strong>.
                </p>

                <div className="space-y-1">
                    <p><strong>Trục ngang (ngày):</strong> hiển thị các ngày trong kế hoạch từ lúc bắt đầu đến ngày kết thúc.</p>
                    <p><strong>Trục dọc (số điếu thuốc):</strong> cho thấy số lượng nên hút mỗi ngày tương ứng.</p>
                    <p><strong>Đường kẻ giảm dần:</strong> thể hiện lộ trình cai thuốc đều đặn và rõ ràng.</p>
                </div>

                {endingCigs === 0 && (
                    <div className="mt-4 p-2 bg-yellow-50 border-l-4 border-yellow-400">
                        <p className="text-gray-700">
                            🎉 <em>Chúc mừng! Kế hoạch này sẽ giúp bạn cai thuốc hoàn toàn. Hãy kiên trì thực hiện để đạt được mục tiêu!</em>
                        </p>
                    </div>
                )}

                {warningsCount > 0 && (
                    <div className="mt-4 p-2 bg-yellow-50 border-l-4 border-yellow-400">
                        <p className="text-gray-700">
                            ⚠️ <em>Lưu ý: Có {warningsCount} ngày trong kế hoạch cần điều chỉnh để đảm bảo tính khả thi.</em>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlanSummaryReport;