function Hero() {
    return (
        <section className="px-6 h-[472px] flex py-10 bg-[#fef1db]">
            <div
                className="hidden md:block bg-[url(/community.png)] w-[70%] h-auto bg-no-repeat bg-cover bg-center"></div>
            <div className="container-custom text-center flex flex-col justify-center h-full px-16 py-16">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                    Cộng đồng
                </h1>
                <p className="text-left text-md md:text-lg text-gray-600 max-w-3xl mx-auto">
                    Cộng đồng QuitEz luôn chào đón tất cả mọi người, dù bạn đang ở giai đoạn nào trên hành trình cai
                    thuốc. Hãy khám phá những câu chuyện của người khác để tìm cảm hứng, sự động viên và động lực cho
                    riêng mình.
                    <br/>
                    Bạn cũng có thể chia sẻ trải nghiệm của bản thân, xin lời khuyên hoặc tiếp thêm sức mạnh cho người
                    khác. Đừng quên xem qua nội quy cộng đồng để giữ cho nơi đây luôn tích cực và an toàn cho tất cả mọi
                    người nhé!
                </p>
            </div>
        </section>
    )
}

export default Hero