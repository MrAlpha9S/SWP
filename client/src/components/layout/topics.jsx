import React from 'react';
import { DownOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const topicRow1 = [
  {
    navigator: '/preparing-to-quit',
    title: 'Chuẩn bị bỏ thuốc',
  },
  {
    navigator: '/smoking-and-your-health',
    title: 'Hút thuốc và sức khỏe của bạn',
  },
  {
    navigator: '/smoking-and-pregnancy',
    title: 'Hút thuốc và mang thai',
  }
];
const topicRow2 = [
  {
    navigator: '/helping-friends-and-family-quit',
    title: 'Trẻ em và gia đình',
  },
  {
    navigator: '/cravings-triggers-and-routines',
    title: 'Sự thèm muốn, kích thích và thói quen',
  },
  {
    navigator: '/preparing-to-stop-smoking',
    title: 'Chuẩn bị hành trang cai thuốc lá',
  }
];

const topicRow3 = [
  {
    navigator: '/vaping',
    title: 'Hút thuốc lá điện tử',
  },
  {
    navigator: '/resources-for-health-professionals',
    title: 'Tài nguyên dành cho các chuyên gia y tế và chuyên gia khác',
  },
];

const TopicsDropdown = () => {
  const navigate = useNavigate();
  return (
    <div className="relative group">
      {/* Trigger Button */}
      <div className="cursor-pointer">
        Bài viết <DownOutlined />
      </div>

      {/* Dropdown block - stays open when hovering over dropdown too */}
      <div className="absolute left-0 top-full z-50 mt-2 w-[800px] bg-white shadow-lg border border-gray-100 p-6
    opacity-0 invisible group-hover:opacity-100 group-hover:visible hover:opacity-100 hover:visible transition-all duration-200">
        <div className="flex items-center justify-between mb-2">
          <a onClick={() => navigate('/topics')} className="text-lg font-semibold text-primary-700 flex items-center gap-1 hover:underline">
            Bài viết <ArrowRightOutlined />
          </a>
        </div>
        <p className="text-gray-500 mb-4 text-sm">
          Tìm hiểu về các triệu chứng cai nghiện, cách xử lý khi tái hút, cách bỏ thuốc khi mang thai và nhiều điều khác.
        </p>
        <br />
        <div className="grid grid-cols-3 gap-6 text-sm text-primary-700">
          {topicRow1.map((item) => (
            <div key={item.navigator} className="hover:underline cursor-pointer" onMouseDown={e => e.preventDefault()} onClick={e => { e.stopPropagation(); navigate('/topics' + item.navigator); }}>
              {item.title}
            </div>
          ))}
          {topicRow2.map((item) => (
            <div key={item.navigator} className="hover:underline cursor-pointer" onMouseDown={e => e.preventDefault()} onClick={e => { e.stopPropagation(); navigate('/topics' + item.navigator); }}>
              {item.title}
            </div>
          ))}
          {topicRow3.map((item) => (
            <div key={item.navigator} className="hover:underline cursor-pointer" onMouseDown={e => e.preventDefault()} onClick={e => { e.stopPropagation(); navigate('/topics' + item.navigator); }}>
              {item.title}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopicsDropdown;
