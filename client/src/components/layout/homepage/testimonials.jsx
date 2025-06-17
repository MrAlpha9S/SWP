function Testimonials() {
  const testimonials = [
    {
      quote: "Sau nhiều năm cố gắng cai thuốc, chương trình này cuối cùng đã giúp tôi thành công. Phương pháp cá nhân hóa thực sự tạo nên sự khác biệt.",
      author: "Michael T.",
      title: "Không hút thuốc trong 8 tháng"
    },
    {
      quote: "Sự hỗ trợ 24/7 đã giúp tôi vượt qua những cơn thèm thuốc khó khăn nhất. Tôi chưa bao giờ cảm thấy cô đơn trong hành trình cai thuốc của mình.",
      author: "Sarah L.",
      title: "Không hút thuốc trong 1 năm"
    },
    {
      quote: "Sự kết hợp giữa các công cụ và sự hỗ trợ đã mang lại cho tôi sự tự tin cần thiết để cai thuốc hoàn toàn.",
      author: "David R.",
      title: "Không hút thuốc trong 6 tháng"
    }
  ]

  return (
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-4">
            Câu chuyện thành công
          </h2>
          <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
            Lắng nghe những người đã thành công trong việc cai thuốc lá với sự giúp đỡ từ chương trình của chúng tôi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
                <div
                    key={index}
                    className="card hover:shadow-lg flex flex-col"
                >
                  <div className="text-primary-600 mb-4">
                    <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>
                  <p className="text-gray-600 italic mb-6">
                    "{testimonial.quote}"
                  </p>
                  <div className="mt-auto">
                    <p className="font-semibold text-gray-800">{testimonial.author}</p>
                    <p className="text-gray-500 text-sm">{testimonial.title}</p>
                  </div>
                </div>
            ))}
          </div>
        </div>
      </section>
  )
}

export default Testimonials
