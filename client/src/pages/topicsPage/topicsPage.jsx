import React from 'react';
import { ArrowRightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const topics = [
  {
    navigator: '/preparing-to-quit',
    title: 'Chuẩn bị bỏ thuốc',
    description:
      'Nếu bạn đang nghĩ đến việc bỏ thuốc, việc hiểu rõ sự thật về thuốc lá và thuốc lá điện tử có thể giúp bạn bắt đầu.',
  },
  {
    navigator: '/smoking-and-your-health',
    title: 'Hút thuốc và sức khỏe của bạn',
    description:
      'Ngay khi bạn bỏ thuốc lá, cơ thể bạn sẽ bắt đầu tự phục hồi và sức khỏe sẽ được cải thiện.',
  },
  {
    navigator: '/smoking-and-pregnancy',
    title: 'Hút thuốc và mang thai',
    description:
      'Bỏ thuốc lá ở bất kỳ thời điểm nào trong thai kỳ đều có thể giúp giảm nguy cơ sức khỏe cho bạn và em bé.',
  },
  {
    navigator: '/helping-friends-and-family-quit',
    title: 'Trẻ em và gia đình',
    description:
      'Việc bỏ thuốc lá không chỉ có lợi cho bản thân bạn mà còn cho những người thân yêu của bạn.',
  },
  {
    navigator: '/cravings-triggers-and-routines',
    title: 'Sự thèm muốn, kích thích và thói quen',
    description:
      'Những người hút thuốc lá và thuốc lá điện tử thường có cảm giác thèm muốn và kích thích.',
  },
  {
    navigator: '/preparing-to-stop-smoking',
    title: 'Chuẩn bị hành trang cai thuốc lá',
    description:
      'Nếu ai đó bạn biết đang cố gắng cai thuốc, việc ủng hộ họ là một trong những điều quan trọng nhất bạn có thể làm.',
  },
  {
    navigator: '/vaping',
    title: 'Hút thuốc lá điện tử',
    description:
      'Điều tốt nhất bạn có thể làm cho sức khỏe của mình là không hút thuốc và không hút thuốc lá điện tử.',
  },
  {
    navigator: '/resources-for-health-professionals',
    title: 'Tài nguyên dành cho các chuyên gia y tế và chuyên gia khác',
    description:
      'Cung cấp thông tin và khuyến khích bỏ thuốc lá có thể tạo ra sự khác biệt thực sự cho khách hàng của bạn.',
  },
];

const TopicsPage = () => {
    const navigate = useNavigate();
  return (
    <div className="bg-primary-50 min-h-screen px-4 md:px-12 py-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold text-primary-800 mb-4">Topics</h1>
          <p className="text-gray-700 text-lg">
            Quitting smoking is a journey, and it helps to have the right information at the right time. Whether you're
            just thinking about quitting or have already taken the first step, our topics are here to guide and support
            you.
          </p>
        </div>
        {/* Right image placeholder (replace with actual image if needed) */}
        <div className="w-[300px] h-[220px] bg-primary-100 rounded-lg flex items-center justify-center">
          {/* placeholder */}
          <span className="text-primary-400">[Image]</span>
        </div>
      </div>

      {/* Cards */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {topics.map((topic, index) => (
          <button
            onClick={() => navigate('/topics' + topic.navigator)}
            key={index}
            className="bg-white hover:bg-primary-50 transition p-6 rounded-xl shadow-md border border-gray-100"
          >
            {/* Top image placeholder */}
            <div className="w-full h-[120px] bg-primary-100 mb-4 rounded-md flex items-center justify-center">
              <span className="text-primary-400">[Image]</span>
            </div>

            <h3 className="text-lg font-semibold text-primary-800">{topic.title}</h3>
            <p className="text-gray-600 mt-2 text-sm">{topic.description}</p>

            <div className="mt-4 text-primary-700 flex items-center gap-1 text-sm font-medium cursor-pointer hover:underline">
               <ArrowRightOutlined />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TopicsPage;
