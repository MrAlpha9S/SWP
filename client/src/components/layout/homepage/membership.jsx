import { FiCheck } from 'react-icons/fi'

function Membership() {
  const plans = [
    {
      name: 'Cơ Bản',
      price: 'Miễn phí',
      features: [
        'Truy cập diễn đàn cộng đồng',
        'Kế hoạch cai nghiện cá nhân hóa',
        'Công cụ theo dõi cơ bản',
        'Tài liệu giáo dục',
        'Truy cập các công cụ quản lý cơn thèm'
      ],
      buttonText: 'Đăng ký',
      popular: false
    },
    {
      name: 'Cao Cấp',
      price: '$9.99/tháng',
      features: [
        'Tất cả trong gói Cơ Bản',
        'Hỗ trợ trò chuyện 24/7 với AI',
      ],
      buttonText: 'Bắt đầu ngay',
      popular: true
    },
    {
      name: 'Chuyên Nghiệp',
      price: '$19.99/tháng',
      features: [
        'Tất cả trong gói Cao Cấp',
        'Tư vấn trực tiếp với huấn luyện viên được chứng nhận',
      ],
      buttonText: 'Chọn gói Pro',
      popular: false
    }
  ]


  return (
    <section className="py-16">
      <div className="container-custom">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-4">
          Gói đăng ký
        </h2>
        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
          Chọn gói đăng ký phù hợp với nhu cầu của bạn.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={` flex flex-col card hover:shadow-lg relative ${plan.popular ? 'border-2 border-primary-500 transform md:scale-105' : ''}`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              )}
              <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">
                {plan.name}
              </h3>
              <p className="text-2xl md:text-3xl font-bold text-center text-primary-600 mb-6">
                {plan.price}
              </p>
              <ul className="mb-8 space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <FiCheck className="text-success-500 mr-2 flex-shrink-0" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <button 
                className={`mt-auto btn w-full ${plan.popular ? 'btn-primary' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Membership