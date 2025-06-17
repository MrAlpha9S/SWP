function Hero({title, img, children}) {
    return (
        <section className="px-6 h-[472px] flex py-10 bg-[#fef1db]">
            <div
                className="hidden md:block w-[70%] h-auto bg-no-repeat bg-cover bg-center" style={{ backgroundImage: `url(${img})` }}></div>
            <div className="container-custom text-center flex flex-col justify-center h-full px-16 py-16">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                    {title}
                </h1>
                <p className="text-left text-md md:text-lg text-gray-600 max-w-3xl mx-auto">
                    {children}
                </p>
            </div>
        </section>
    )
}

export default Hero