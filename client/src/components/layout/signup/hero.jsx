import React from "react";

function Hero() {

  return (
      <section className="py-16 md:py-24">
        <div className="flex flex-col items-start px-14 w-full h-full">
          <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Tạo kế hoạch cai thuốc
          </p>
          <div className="flex flex-col items-start text-lg md:text-xl text-gray-600 mb-8">
            <p>Chúc mừng bạn chọn bước đi đầu tiên trên hành trình cai thuốc!</p>
            <p>Chúng tôi sẽ luôn bên cạnh khi bạn lên kế hoạch cho một cuộc sống khỏe mạnh không khói thuốc.</p>
          </div>
        </div>
      </section>
  )
}

export default Hero