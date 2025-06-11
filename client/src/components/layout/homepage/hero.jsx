import { useNavigate } from 'react-router-dom';

function Hero() {
  const navigate = useNavigate();

  return (
    <section className="px-16 h-[472px] flex py-10">
      <div className="hidden md:block bg-[url(/homepage-hero.png)] bg-no-repeat bg-cover bg-center h-full w-[45%]"></div>
      <div className="container-custom text-center h-full px-16 py-16">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
          Bắt đầu hành trình sống không thuốc lá từ hôm nay
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Lên kế hoạch, theo dõi quá trình cai thuốc mỗi ngày và nhận sự đồng hành từ chuyên gia cùng cộng đồng của chúng tôi — để việc bỏ thuốc trở nên nhẹ nhàng và hiệu quả hơn.
        </p>
        <button onClick={() => navigate('/onboarding')} className="btn btn-primary text-base md:text-lg px-6 py-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all">
          Bắt đầu ngay
        </button>
      </div>
    </section>
  )
}

export default Hero