import { FiRefreshCw, FiSearch, FiZap } from 'react-icons/fi'

function SupportMethods() {
  const methods = [
    {
      icon: <FiRefreshCw className="w-10 h-10 text-primary-500" />,
      title: 'Thay đổi thói quen',
      description: 'Nhận diện các yếu tố kích thích việc hút thuốc, phá vỡ các thói quen tiêu cực và xây dựng những thói quen lành mạnh để thay thế.'
    },
    {
      icon: <FiSearch className="w-10 h-10 text-primary-500" />,
      title: 'Tìm kiếm sự hỗ trợ',
      description: 'Tiếp cận tư vấn 24/7, tham gia cộng đồng của chúng tôi và kết nối với những người đang trên cùng hành trình.'
    },
    {
      icon: <FiZap className="w-10 h-10 text-primary-500" />,
      title: 'Chiến lược thay thế',
      description: 'Sử dụng các phương pháp thay thế nicotine đã được khoa học chứng minh để kiểm soát cơn thèm thuốc.'
    }
  ]

  return (
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-4">
            EzQuit giúp bạn cai thuốc như thế nào
          </h2>
          <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
            EzQuit kết hợp các phương pháp đã được chứng minh với công nghệ hiện đại để giúp bạn cai thuốc hiệu quả và lâu dài.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {methods.map((method, index) => (
                <div
                    key={index}
                    className="card hover:shadow-lg group"
                >
                  <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    {method.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    {method.title}
                  </h3>
                  <p className="text-gray-600">
                    {method.description}
                  </p>
                </div>
            ))}
          </div>
        </div>
      </section>
  )
}

export default SupportMethods
