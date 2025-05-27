function Hero() {
  return (
    <section className="bg-gradient-to-br from-gray-100 to-gray-200 py-16 md:py-24">
      <div className="container-custom text-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
          Start Your Smoke-Free Journey Today
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Our step-by-step program helps you break free from nicotine addiction with proven methods and ongoing support.
        </p>
        <button className="btn btn-primary text-base md:text-lg px-6 py-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all">
          Get Started
        </button>
      </div>
    </section>
  )
}

export default Hero