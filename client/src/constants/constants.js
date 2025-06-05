
export const checkboxStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
};

export const readinessRadioOptions = [
    { value: 'ready', label: 'Tôi đã sẵn sàng' },
    { value: 'relapse-support', label: 'Tôi đã cai thuốc nhưng vẫn cần hỗ trợ để duy trì' },
]

export const reasonListOptions = [
    { value: "health", label: "Lý do sức khỏe" },
    { value: "physical", label: "Lý do thể chất" },
    { value: "cost", label: "Chi phí mua thuốc lá" },
    { value: "pregnancy", label: "Lý do mang thai" },
    { value: "see_children_grow", label: "Muốn được nhìn thấy con cái khôn lớn" },
    { value: "protect_children", label: "Không muốn việc hút thuốc của mình ảnh hưởng đến con" },
    { value: "family_health", label: "Ảnh hưởng của việc hút thuốc đến sức khỏe gia đình" },
    { value: "encouraged_by_loved_ones", label: "Được người thân, bạn bè hoặc bạn đời khuyên nhủ/giục giã" },
    { value: "doctor_advice", label: "Được bác sĩ hoặc chuyên gia y tế tư vấn" },
    { value: "anti_smoking_ads", label: "Quảng cáo chống hút thuốc" },
    { value: "not_fun_anymore", label: "Tôi không còn thấy việc hút thuốc thú vị nữa" },
    { value: "public_ban", label: "Các quy định cấm hút thuốc ở nơi công cộng" },
    { value: "warning_labels", label: "Cảnh báo sức khỏe trên bao thuốc" },
    { value: "other", label: "Lý do khác" },
];


export const timeAfterWakingRadioOptions = [
        { value: "within_5", label: "Trong vòng 5 phút"},
        { value: "6_30", label: "Từ 6 đến 30 phút"},
        { value: "31_60", label: "Từ 31 đến 60 phút"},
        { value: "after_60", label: "Sau 60 phút"},
        { value: "midday", label: "Giữa trưa"},
]

export const timeOfDayOptions = [
    { value: "after_waking", label: "Ngay sau khi thức dậy" },
    { value: "breakfast", label: "Bữa ăn sáng" },
    { value: "after_lunch", label: "Sau bữa trưa" },
    { value: "afternoon_meal", label: "Bữa ăn chiều" },
    { value: "work_break", label: "Giờ giải lao tại nơi làm việc" },
    { value: "after_work", label: "Ngay sau giờ làm" },
    { value: "before_dinner", label: "Trước bữa tối" },
    { value: "after_dinner", label: "Sau bữa tối" },
    { value: "evening", label: "Buổi tối" },
    { value: "before_bed", label: "Trước khi đi ngủ" },
    { value: "other", label: "Khác" },
];

export const smokingTriggerOptions = [
    { value: "drinking_alcohol", label: "Uống rượu" },
    { value: "drinking_coffee_tea", label: "Uống cà phê hoặc trà" },
    { value: "driving", label: "Lái xe" },
    { value: "feeling_stressed", label: "Cảm thấy căng thẳng" },
    { value: "feeling_bored", label: "Cảm thấy buồn chán" },
    { value: "eating_or_after_meal", label: "Khi ăn hoặc sau khi ăn" },
    { value: "after_sex", label: "Sau khi quan hệ tình dục" },
    { value: "planning_next_task", label: "Khi lập kế hoạch làm việc tiếp theo" },
    { value: "self_reward", label: "Để tự thưởng cho bản thân" },
    { value: "around_smokers", label: "Khi ở cùng người hút thuốc hoặc vape" },
    { value: "using_phone_computer", label: "Khi sử dụng điện thoại hoặc máy tính" },
    { value: "partying", label: "Tiệc tùng" },
    { value: "any_opportunity", label: "Tôi hút bất cứ khi nào có cơ hội" },
    { value: "other", label: "Khác" },
];

export const onboardingErrorMsg = [
    {atPage: "readiness", location: "readinessRadio", message: "Vui lòng chọn 1"},
    {atPage: "reason", location: "reasonCheckbox", message: "Vui lòng chọn ít nhất 3 lý do"},
    {atPage: "cigInfo", location: "pricePerPack", message: "Giá tiền không hợp lệ"},
    {atPage: "cigInfo", location: "cigsPerPack", message: "Số điếu không hợp lệ"},
    {atPage: "cigInfo", location: "cigsPerDay", message: "Số điếu không hợp lệ"},
    {atPage: "smokingRoutine", location: "timeAfterWaking", message: "Vui lòng chọn 1"},
    {atPage: "smokingRoutine", location: "timeOfDay", message: "Vui lòng chọn ít nhất 1"},
    {atPage: "smokingRoutine", location: "triggers", message: "Vui lòng chọn ít nhất 1"},
    {atPage: "smokingRoutine", location: "customTimeOfDay", message: "Không để trống mục này"},
    {atPage: "smokingRoutine", location: "customTrigger", message: "Không để trống mục này"},
    {atPage: "createPlan", location: "startDate", message: "Vui lòng chọn ngày"},
    {atPage: "createPlan", location: "cigsPerDay", message: "Số điếu không hợp lệ"},
    {atPage: "createPlan", location: "quitMethod", message: "Vui lòng chọn 1"},
    {atPage: "createPlan", location: "cigsReduced", message: "Số điếu không hợp lệ"},
    {atPage: "createPlan", location: "expectedQuitDate", message: "Vui lòng chọn ngày"},
    {atPage: "createPlan", location: "stoppedDate", message: "Vui lòng chọn ngày"},
    {atPage: "setGoal", location: "goalName", message: "Không để trống mục này"},
    {atPage: "setGoal", location: "goalAmount", message: "Số tiền không hợp lệ"},
    {atPage: "setGoal", location: "goalList", message: "Bạn chưa tạo mục tiêu nào. Nếu không muốn tạo mục tiêu, hãy bỏ chọn Thêm mục tiêu tiết kiệm"},
]

export const quittingMethodOptions = [
    {value: "gradual-daily", label: "Giảm dần số điếu thuốc mỗi ngày"},
    {value: "gradual-weekly", label: "Giảm dần số điếu thuốc mỗi tuần"},
    {value: "target-date", label: "Chọn ngày muốn bỏ hoàn toàn"}
]

