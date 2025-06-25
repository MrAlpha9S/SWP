import { useNavigate } from 'react-router-dom';

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
        <div className="absolute bottom-[-130px] flex w-full h-[50%]">
          <div className="w-[50%] bg-primary-600 hover:-translate-y-16 transition-transform duration-700 opacity-70"></div>
          <div className="w-[50%] bg-secondary-600 hover:-translate-y-16 transition-transform duration-700 opacity-30"></div>
        </div>
      </div>
    </section>
  )
}

export default Hero