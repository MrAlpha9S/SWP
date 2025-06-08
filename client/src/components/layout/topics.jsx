import React from 'react';
import { DownOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const topics = [
  ['Preparing to quit', 'Children and family', 'Vaping'],
  ['Smoking and your health', 'Cravings, triggers and routines', 'Resources for health professionals'],
  ['Smoking and pregnancy', 'Helping friends and family quit'],
];

const TopicsDropdown = () => {
  const navigate = useNavigate();
  return (
    <div className="relative group">
      {/* Trigger Button */}
      <div>
        Topics <DownOutlined />
      </div>

      {/* Dropdown block - stays open when hovering over dropdown too */}
      <div className="absolute left-0 top-full z-50 mt-2 w-[800px] bg-white shadow-lg border border-gray-100 p-6 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200">
        <div className="flex items-center justify-between mb-2">
          <a onClick={() => navigate('/topics')} className="text-lg font-semibold text-primary-700 flex items-center gap-1 hover:underline">
            Topics <ArrowRightOutlined />
          </a>
        </div>
        <p className="text-gray-500 mb-4 text-sm">
          Learn about withdrawal symptoms, managing slip-ups, how to quit while pregnant and much more.
        </p>

        <div className="grid grid-cols-3 gap-6 text-sm text-primary-700">
          {topics.map((column, colIdx) => (
            <ul key={colIdx} className="space-y-3 border-t border-gray-200 pt-3">
              {column.map((item, idx) => (
                <li key={idx} className="hover:underline cursor-pointer">
                  {item}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopicsDropdown;
