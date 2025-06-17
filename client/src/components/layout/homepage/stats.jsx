function Stats() {
  const stats = [
    {
      value: '24/7',
      label: 'Hỗ trợ liên tục',
      description: 'Đội ngũ của chúng tôi luôn sẵn sàng hỗ trợ bạn trong suốt hành trình với hướng dẫn mọi lúc mọi nơi.'
    },
    {
      value: '2 triệu+',
      label: 'Người dùng đã được hỗ trợ',
      description: 'Tham gia cùng cộng đồng hơn 2 triệu người đã cai thuốc lá thành công.'
    },
    {
      value: '40%',
      label: 'Tăng tỷ lệ thành công',
      description: 'Chương trình của chúng tôi giúp tăng 40% cơ hội cai thuốc thành công so với việc tự làm một mình.'
    },
    {
      value: '96%',
      label: 'Tỷ lệ hài lòng',
      description: 'Hơn 96% người dùng của chúng tôi sẵn sàng giới thiệu chương trình cho bạn bè và người thân.'
    }
  ]

  return (
      <section className="py-12 ">
        <div className="container-custom">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">
            Tại sao chọn chương trình của chúng tôi
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
                <div
                    key={index}
                    className="card hover:shadow-lg hover:scale-105 cursor-pointer flex flex-col items-center text-center"
                >
                  <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                    {stat.value}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    {stat.label}
                  </h3>
                  <p className="text-gray-600">
                    {stat.description}
                  </p>
                </div>
            ))}
          </div>
        </div>
      </section>
  )
}

export default Stats
