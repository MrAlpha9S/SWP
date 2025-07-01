function Hero({title, img, children, heroHeight = 472}) {
    return (
        <section style={{height: heroHeight, transition: 'height 0.2s'}}
                 className="sticky top-[80px] z-10 px-6 flex justify-center py-10 bg-[#fef1db] w-full">
            <div className="flex w-[1280px]">
                <div
                    className="hidden md:block w-full h-auto bg-no-repeat bg-cover bg-center"
                    style={{backgroundImage: heroHeight === 472 && `url(${img})`}}></div>
                {heroHeight === 472 ?
                    <div className="w-full text-left flex flex-col justify-center h-full px-16 py-16">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                            {title}
                        </h1>
                        <p className="text-left text-md md:text-lg text-gray-600 max-w-3xl mx-auto">
                            {children}
                        </p>
                    </div> :
                    <div className="text-left flex flex-col justify-center h-full w-full">
                        <h1 className="text-left text-xl md:text-1xl lg:text-2xl font-bold text-gray-900 w-[40%]">
                            {title}
                        </h1>
                    </div>}
            </div>

        </section>
    )
}

export default Hero