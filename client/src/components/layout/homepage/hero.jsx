import { useNavigate } from 'react-router-dom';
import CustomButton from "../../ui/CustomButton.jsx";

function Hero() {
  const navigate = useNavigate();

  return (
    <section className="overflow-hidden h-[600px] bg-[url(/homepage-hero.jpg)] bg-no-repeat bg-cover bg-center flex relative">
      <div className="mt-44 h-full w-full flex flex-col">
        <h1 className="text-center text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
          Bắt đầu hành trình <br/> sống không thuốc lá từ hôm nay
        </h1>
        {/*<p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">*/}
        {/*  Lên kế hoạch, theo dõi quá trình cai thuốc mỗi ngày và nhận sự đồng hành từ chuyên gia cùng cộng đồng của chúng tôi — để việc bỏ thuốc trở nên nhẹ nhàng và hiệu quả hơn.*/}
        {/*</p>*/}
        {/*<button onClick={() => navigate('/onboarding')} className="btn btn-primary text-base md:text-lg px-6 py-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all">*/}
        {/*  Bắt đầu ngay*/}
        {/*</button>*/}
        <div className="absolute bottom-[-130px] flex w-full h-[50%] text-white">
          <div className="relative w-[50%] hover:-translate-y-16 transition-all duration-700 flex justify-end overflow-hidden group p-4">
            <div className="absolute inset-0 bg-primary-600 opacity-70 group-hover:opacity-100 transition-opacity duration-700 z-0"></div>
            <div className="relative z-10 w-[75%]">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                Tôi chỉ cần công cụ theo dõi cơ bản
              </h2>
              <p>
                Bạn muốn chủ động trong hành trình bỏ thuốc? Ứng dụng cung cấp các công cụ theo dõi cơ bản và các hoạt động hỗ trợ cai thuốc - hoàn toàn miễn phí.
              </p>
              <div className="w-full flex justify-start opacity-0 group-hover:opacity-100 transition-opacity duration-700 mt-4">
                <CustomButton type='whitePrimary' onClick={() => navigate('/onboarding')}>Bắt đầu ngay</CustomButton>
              </div>
            </div>
          </div>


          <div className="relative w-[50%] hover:-translate-y-16 transition-all duration-700 flex justify-start overflow-hidden group p-4">
            <div className="absolute inset-0 bg-secondary-400 opacity-70 group-hover:opacity-100 transition-opacity duration-700 z-0 "></div>
            <div className="relative z-10 w-[75%]">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-4">Tôi cần một kế hoạch</h2>
              <p>Bạn cần một lộ trình rõ ràng và người đồng hành đáng tin cậy? Kế hoạch với lộ trình rõ ràng, có huấn luyện viên hướng dẫn từng giai đoạn sẽ giúp bạn bỏ thuốc dễ dàng hơn và duy trì kết quả bền vững.</p>
              <div className="w-full flex justify-start opacity-0 group-hover:opacity-100 transition-opacity duration-700 mt-4">
                <CustomButton onClick={() => navigate('/subscription')} type='whiteSecondary' >Tìm hiểu thêm</CustomButton>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default Hero