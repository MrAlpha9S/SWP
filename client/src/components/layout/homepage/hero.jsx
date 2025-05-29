import { useNavigate } from 'react-router-dom';

function Hero() {
  const navigate = useNavigate();

  return (
    <section className="py-16 md:py-24">
      <div className="container-custom text-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
          Bắt đầu hành trình không khói thuốc ngay bây giờ
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Theo dõi tiến trình cai thuốc mỗi ngày cùng với sự giúp đỡ từ các chuyên gia và cộng đồng người dùng của chúng tôi sẽ giúp hành trình cai thuốc của bạn dễ dàng hơn.
        </p>
        <button onClick={() => navigate('/onboarding')} className="btn btn-primary text-base md:text-lg px-6 py-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all">
          Bắt đầu ngay
        </button>
      </div>
    </section>
  )
}

export default Hero