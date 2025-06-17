function Hero({title, img, children, heroHeight = 472}) {
    return (
        <section style={{height: heroHeight, transition: 'height 0.2s'}}
                 className="sticky top-[80px] z-50 px-6 flex py-10 bg-[#fef1db]">
            <div
                className="hidden md:block w-[70%] h-auto bg-no-repeat bg-cover bg-center"
                style={{backgroundImage: heroHeight === 472 && `url(${img})`}}></div>
            {heroHeight === 472 ?
                <div className="container-custom text-left flex flex-col justify-center h-full px-16 py-16">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        {title}
                    </h1>
                    <p className="text-left text-md md:text-lg text-gray-600 max-w-3xl mx-auto">
                        {children}
                    </p>
                </div> :
                <div className="container-custom text-left flex flex-col justify-center h-full ">
                    <h1 className="text-xl md:text-1xl lg:text-2xl font-bold text-gray-900">
                        {title}
                    </h1>
                </div>}
        </section>
    )
}

export default Hero