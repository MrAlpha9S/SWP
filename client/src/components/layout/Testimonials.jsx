function Testimonials() {
  const testimonials = [
    {
      quote: "After trying to quit for years, this program finally helped me succeed. The personalized approach made all the difference.",
      author: "Michael T.",
      title: "Smoke-free for 8 months"
    },
    {
      quote: "The 24/7 support got me through the toughest cravings. I never felt alone in my journey to quit.",
      author: "Sarah L.",
      title: "Smoke-free for 1 year"
    },
    {
      quote: "The combination of tools and support gave me the confidence I needed to finally quit for good.",
      author: "David R.",
      title: "Smoke-free for 6 months"
    }
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-4">
          Success Stories
        </h2>
        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
          Hear from people who have successfully quit smoking with our program.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="card hover:shadow-lg"
            >
              <div className="text-primary-600 mb-4">
                <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              <p className="text-gray-600 italic mb-6">
                "{testimonial.quote}"
              </p>
              <div>
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