import {Divider} from "antd";
import { Calendar, Heart, Bike, Users, MessageSquare, MonitorSmartphone } from 'lucide-react';

function Stats() {
  const items = [
    {
      icon: <Calendar className="w-6 h-6" />,
      text: "Chọn một ngày để bắt đầu cai thuốc, sau đó làm việc trực tiếp với Huấn luyện viên để cá nhân hoá một lộ trình đã được xây dựng sẵn. Bạn sẽ được đồng hành và hỗ trợ xuyên suốt quá trình theo sát kế hoạch phù hợp với riêng mình.",
    },
    {
      icon: <Heart className="w-6 h-6" />,
      text: "Học hỏi những tác hại của thuốc lá. Đồng thời biết thêm về những liệu pháp cai thuốc như NRT có thể giúp bạn tăng khả năng bỏ thuốc mãi mãi.",
    },
    {
      icon: <Bike className="w-6 h-6" />,
      text: "Xây dựng chiến lược để kiểm soát căng thẳng, tránh tăng cân và duy trì vận động trong suốt quá trình cai thuốc – và cả sau khi bỏ thuốc thành công.",
    },
    {
      icon: <Users className="w-6 h-6" />,
      text: "Chia sẻ và nhận lời khuyên từ cộng đồng của chúng tôi bao gồm những thành viên cũng trải qua quá trình cai thuốc.",
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      text: "Chat hoặc video call trực tiếp với Huấn luyện viên bất cứ lúc nào để nhận sự giúp đỡ kịp thời.",
    },
    {
      icon: <MonitorSmartphone className="w-6 h-6" />,
      text: "Truy cập nền tảng, công cụ theo dõi và hỗ trợ bỏ thuốc 24/7.",
    },
  ];

  return (
      <section className="py-12  flex flex-col items-center">
        <div className="w-[1000px]">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">
            Đã đến lúc nói lời tạm biệt với thuốc lá
          </h2>
          <Divider />

          <p>Dù những bước đầu có thể khó khăn, nhưng hành trình đến một cuộc sống không thuốc lá sẽ dễ dàng hơn khi bạn có được sự hỗ trợ đúng đắn. Chương trình “Tự do khỏi thuốc lá” của chúng tôi là một phương pháp đã được kiểm chứng giúp bạn cai thuốc thành công – và duy trì kết quả – ngay cả khi bạn đã từng thử và tái nghiện trước đó.</p>

          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mt-10 mb-12">
            Với gói đăng ký Premium của chúng tôi, bạn sẽ có được:
          </h2>
          <div className="grid grid-cols-1 w-[1000px] md:grid-cols-2 gap-8 mx-auto">
            {items.map((item, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="text-blue-700">{item.icon}</div>
                  <p className="text-gray-700">{item.text}</p>
                </div>
            ))}
          </div>
        </div>
      </section>
  )
}

export default Stats
