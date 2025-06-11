

function Hero() {


    return (
        <section className="px-16 h-[472px] flex py-10 bg-[#fef1db]">
            <div className="hidden md:block bg-[url(/plan-hero.png)] bg-no-repeat bg-cover bg-center h-full w-[45%]"></div>
            <div className="container-custom text-center flex flex-col justify-center h-full px-16 py-16">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                    Tạo kế hoạch cai thuốc
                </h1>
                <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                    Chúc mừng bạn chọn bước đi đầu tiên trên hành trình cai thuốc!<br/>
                    Chúng tôi sẽ luôn bên cạnh khi bạn lên kế hoạch cho một cuộc sống khỏe mạnh không khói thuốc.
                </p>
            </div>
        </section>
    )
}

export default Hero