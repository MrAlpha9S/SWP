

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
    { value: "other", label: "Thời điểm khác" },
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
    { value: "other", label: "Yếu tố khác" },
];

export const onboardingErrorMsg = [
    {atPage: "readiness", location: "readinessRadio", message: "Vui lòng chọn 1"},
    {atPage: "reason", location: "reasonCheckbox", message: "Vui lòng chọn ít nhất 3 lý do"},
    {atPage: "cigInfo", location: "pricePerPack", message: "Giá tiền không hợp lệ"},
    {atPage: "cigInfo", location: "cigsPerPack", message: "Số điếu mỗi gói không hợp lệ"},
    {atPage: "cigInfo", location: "cigsPerDay", message: "Số điếu mỗi ngày không hợp lệ"},
    {atPage: "smokingRoutine", location: "timeAfterWaking", message: "Vui lòng chọn ít nhất 1"},
    {atPage: "smokingRoutine", location: "timeOfDay", message: "Vui lòng chọn ít nhất 1 thời điểm"},
    {atPage: "smokingRoutine", location: "triggers", message: "Vui lòng chọn ít nhất 1 yếu tố"},
    {atPage: "smokingRoutine", location: "customTimeOfDay", message: "Không để trống mục này"},
    {atPage: "smokingRoutine", location: "customTrigger", message: "Vui lòng không để trống mục này"},
    {atPage: "createPlan", location: "startDate", message: "Vui lòng chọn ngày"},
    // {atPage: "createPlan", location: "cigsPerDay", message: "Số điếu không hợp lệ"},
    {atPage: "createPlan", location: "quitMethod", message: "Vui lòng chọn 1"},
    {atPage: "createPlan", location: "cigsReduced", message: "Số điếu không hợp lệ"},
    {atPage: "createPlan", location: "expectedQuitDate", message: "Vui lòng chọn ngày"},
    {atPage: "createPlan", location: "stoppedDate", message: "Vui lòng chọn ngày"},
    {atPage: "createPlan", location: "cigsReducedLarge", message: "Số điếu không được lớn hơn số điếu mỗi ngày bạn đã diền"},
    {atPage: "setGoal", location: "goalName", message: "Không để trống mục này"},
    {atPage: "setGoal", location: "goalAmount", message: "Số tiền không hợp lệ"},
    {atPage: "setGoal", location: "goalList", message: "Bạn chưa tạo mục tiêu nào. Nếu không muốn tạo mục tiêu, hãy bỏ chọn Thêm mục tiêu tiết kiệm"},
]

export const quittingMethodOptions = [
    {value: "gradual-daily", label: "Giảm dần số điếu thuốc mỗi ngày"},
    {value: "gradual-weekly", label: "Giảm dần số điếu thuốc mỗi tuần"},
    {value: "target-date", label: "Chọn ngày muốn bỏ hoàn toàn"}
]

export const quitStrategies = [
    { value: "positive_mindset", label: "Tư duy tích cực và tự thúc đẩy bản thân" },
    { value: "social_support", label: "Hỗ trợ từ bạn bè, gia đình hoặc nhóm hỗ trợ" },
    { value: "nrt", label: "Bỏ thuốc hoặc NRT (kẹo cao su, miếng dán, bình xịt, v.v.)" },
    { value: "therapy", label: "Liệu pháp hành vi hoặc tư vấn" },
    { value: "trigger_avoidance", label: "Xác định và tránh các tác nhân gây nghiện hoặc tình huống rủi ro cao" },
    { value: "craving_management", label: "Phát triển cơ chế đối phó với cơn thèm và quản lý căng thẳng" },
    { value: "quit_plan", label: "Kế hoạch bỏ thuốc của tôi với các cột mốc và phần thưởng" },
    { value: "mindfulness", label: "Chánh niệm" },
    { value: "other", label: "Khác" }
];

export const FEELINGS = [
    { value: 'terrible', emoji: '😞', label: 'Tệ' },
    { value: 'bad', emoji: '☹️', label: 'Buồn' },
    { value: 'okay', emoji: '😐', label: 'Ổn' },
    { value: 'good', emoji: '😊', label: 'Tốt' },
    { value: 'great', emoji: '😃', label: 'Tuyệt' },
];

export const qnaOptions = [
    { value: 'smokeCraving', label: 'Bạn có cảm thấy muốn hút thuốc không? Bạn đã làm gì để vượt qua cảm giác đó?' },
    { value: 'healthChanges', label: 'Bạn có nhận thấy bất kỳ thay đổi nào về sức khỏe, tâm trạng hoặc năng lượng của mình không?' },
    { value: 'exercise', label: 'Hôm nay bạn có tập thể dục hay vận động gì không? Bạn cảm thấy thế nào?' },
    { value: 'cravings', label: 'Bạn có thèm ăn không? Điều gì giúp bạn đối phó với chúng?' },
    { value: 'encourage', label: 'Có ai ủng hộ hoặc động viên bạn không? Điều đó khiến bạn cảm thấy thế nào?' },
];

export const savingsTiers = [
    { label: '100,000 VNĐ', amount: 100000, suggestions: ['Cà phê và bánh ngọt tại Highlands', 'Gửi xe cả tuần', 'Mua sổ tay/sách nhỏ'] },
    { label: '300,000 VNĐ', amount: 300000, suggestions: ['1 buổi xem phim', 'Sách kỹ năng', 'Mỹ phẩm cơ bản'] },
    { label: '500,000 VNĐ', amount: 500000, suggestions: ['Đi ăn buffet', 'Thanh toán điện/nước', 'Quần áo mới'] },
    { label: '1,000,000 VNĐ', amount: 1000000, suggestions: ['Đăng ký phòng gym', 'Tai nghe bluetooth', 'Khoá học online'] },
    { label: '2,000,000 VNĐ', amount: 2000000, suggestions: ['Mua đồ nội thất nhỏ', 'Du lịch gần', 'Tặng quà người thân'] },
    { label: '3,000,000 VNĐ', amount: 3000000, suggestions: ['Smartwatch', 'Khoá học chuyên sâu', 'Gửi tiết kiệm'] },
    { label: '5,000,000 VNĐ', amount: 5000000, suggestions: ['Du lịch nội địa', 'Nâng cấp điện thoại', 'Thiết bị làm việc'] },
    { label: '10,000,000 VNĐ', amount: 10000000, suggestions: ['Du lịch nước ngoài', 'Laptop/máy tính bảng', 'Quà cho gia đình'] },
    { label: '20,000,000 VNĐ', amount: 20000000, suggestions: ['Đầu tư học tập', 'Cọc thuê nhà', 'Đổi thiết bị văn phòng'] },
    { label: '50,000,000 VNĐ', amount: 50000000, suggestions: ['Mua xe máy', 'Khởi nghiệp nhỏ', 'Kỳ nghỉ dài'] },
    { label: '100,000,000 VNĐ', amount: 100000000, suggestions: ['Du lịch nước ngoài dài hạn', 'Tiết kiệm dài hạn', 'Học cao học'] },
];

export const quotes = [
    { content: 'Sức khỏe là tài sản quý giá nhất của chúng ta. Đừng để thuốc lá cướp đi điều đó.', author: 'Mark Twain' },
    { content: 'Mỗi ngày không hút thuốc là một chiến thắng nhỏ dẫn đến thành công lớn.', author: 'Winston Churchill' },
    { content: 'Ý chí mạnh mẽ có thể chinh phục mọi thói quen xấu. Bạn mạnh mẽ hơn bạn nghĩ.', author: 'Maya Angelou' },
    { content: 'Tự do thực sự là khi bạn không còn nô lệ cho bất kỳ thói quen nào.', author: 'Nelson Mandela' },
    { content: 'Hãy yêu thương cơ thể bạn. Nó là nơi duy nhất bạn có để sống.', author: 'Jim Rohn' },
    { content: 'Thay đổi khó khăn ban đầu, lộn xộn ở giữa, nhưng tuyệt đẹp ở cuối.', author: 'Robin Sharma' },
    { content: 'Bạn không cần phải hoàn hảo, bạn chỉ cần bắt đầu và kiên trì.', author: 'Tony Robbins' },
    { content: 'Mỗi lần từ chối thuốc lá, bạn đang chọn sự sống thay vì từ từ chết.', author: 'Steve Jobs' },
    { content: 'Sức mạnh không đến từ khả năng vật lý, mà từ ý chí bất khuất.', author: 'Mahatma Gandhi' },
    { content: 'Hành trình ngàn dặm bắt đầu bằng một bước chân. Hôm nay là ngày bắt đầu.', author: 'Lao Tzu' },
    { content: 'Đừng để thói quen của ngày hôm qua cản trở giấc mơ của ngày mai.', author: 'Oprah Winfrey' },
    { content: 'Bạn có thể chịu đựng gần như mọi thứ nếu bạn có lý do đủ mạnh.', author: 'Friedrich Nietzsche' },
    { content: 'Thành công không phải là cuối đích, thất bại không phải là chết người. Điều quan trọng là lòng can đảm tiếp tục.', author: 'Winston Churchill' },
    { content: 'Cơ thể bạn xứng đáng được tôn trọng. Hãy nuôi dưỡng nó, đừng hủy hoại nó.', author: 'Buddha' },
    { content: 'Mỗi phút không hút thuốc là một phút bạn đang tự chữa lành.', author: 'Deepak Chopra' },
    { content: 'Ý chí của bạn mạnh hơn bất kỳ cơn thèm nào. Tin tương vào sức mạnh bên trong.', author: 'Tony Robbins' },
    { content: 'Đôi khi điều nhỏ nhặt nhất tạo nên sự khác biệt lớn nhất trong cuộc đời bạn.', author: 'Dalai Lama' },
    { content: 'Bạn không thể thay đổi quá khứ, nhưng bạn có thể tạo ra một tương lai khỏe mạnh.', author: 'Zig Ziglar' },
    { content: 'Mỗi ngày mới là cơ hội để trở thành phiên bản tốt hơn của chính mình.', author: 'Ralph Waldo Emerson' },
    { content: 'Sự kiên trì có thể biến thất bại thành thành tích phi thường.', author: 'Matt Biondi' },
    { content: 'Hãy nhớ lý do tại sao bạn bắt đầu khi con đường trở nên khó khăn.', author: 'Paulo Coelho' },
    { content: 'Thói quen tốt là chìa khóa của mọi thành công. Thói quen xấu là cánh cửa mở ra thất bại.', author: 'Og Mandino' },
    { content: 'Bạn đủ mạnh để vượt qua điều này. Bạn đã vượt qua những khó khăn trước đây.', author: 'Maya Angelou' },
    { content: 'Sức khỏe không phải là mọi thứ, nhưng không có sức khỏe thì mọi thứ đều không có ý nghĩa.', author: 'Schopenhauer' },
    { content: 'Quyết định quan trọng nhất bạn có thể đưa ra là chăm sóc sức khỏe của mình.', author: 'Warren Buffett' },
    { content: 'Đừng đợi đến ngày mai. Hôm nay là ngày hoàn hảo để bắt đầu cuộc sống mới.', author: 'Napoleon Hill' },
    { content: 'Tự do khỏi thuốc lá là món quà tuyệt vời nhất bạn có thể tặng cho bản thân.', author: 'Benjamin Franklin' },
    { content: 'Mỗi hơi thở sạch là một lời cảm ơn đến cơ thể bạn.', author: 'Thich Nhat Hanh' },
    { content: 'Bạn không cần phải hoàn hảo, chỉ cần tiến bộ một chút mỗi ngày.', author: 'James Clear' },
    { content: 'Một người chiến thắng là một kẻ thua cuộc không bao giờ bỏ cuộc.', author: 'Nelson Mandela' },
    { content: 'Cuộc sống quá ngắn ngủi để lãng phí cho những thói quen hủy hoại sức khỏe.', author: 'Steve Jobs' },
];

export const milestones = [
    {
        label: '24 giờ đến vài ngày sau khi cai thuốc',
        description: 'Nồng độ nicotine trong máu giảm xuống 0. Mức carbon monoxide trong máu trở lại bình thường.',
        hours: 24,
    },
    {
        label: '1 đến 12 tháng sau khi cai thuốc',
        description: 'Ho và khó thở giảm dần.',
        hours: 24 * 30, // ~1 tháng
    },
    {
        label: '1 đến 2 năm sau khi cai thuốc',
        description: 'Nguy cơ bị đau tim giảm rõ rệt.',
        hours: 24 * 365, // ~1 năm
    },
    {
        label: '5 đến 10 năm sau khi cai thuốc',
        description: 'Nguy cơ mắc ung thư miệng, họng và thanh quản giảm một nửa. Nguy cơ đột quỵ cũng giảm.',
        hours: 24 * 365 * 5,
    },
    {
        label: '10 năm sau khi cai thuốc',
        description: 'Nguy cơ mắc ung thư phổi giảm còn khoảng một nửa so với người hút thuốc. Nguy cơ mắc ung thư bàng quang, thực quản và thận cũng giảm.',
        hours: 24 * 365 * 10,
    },
    {
        label: '15 năm sau khi cai thuốc',
        description: 'Nguy cơ mắc bệnh tim mạch gần bằng với người chưa từng hút thuốc.',
        hours: 24 * 365 * 15,
    },
    {
        label: '20 năm sau khi cai thuốc',
        description: 'Nguy cơ mắc nhiều loại ung thư (miệng, họng, thanh quản, tụy) gần như tương đương với người không hút thuốc. Nguy cơ ung thư cổ tử cung giảm một nửa.',
        hours: 24 * 365 * 20,
    },
];


