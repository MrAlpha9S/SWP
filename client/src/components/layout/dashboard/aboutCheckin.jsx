import React from 'react';

const AboutCheckin = () => {
    return (
        <div className='px-5 flex flex-col gap-3'>
            <h2 className='text-left md:text-2xl lg:text-3xl font-bold'>
                Check-in là gì và tại sao bạn nên check-in mỗi ngày?
            </h2>
            <div className="text-left text-sm md:text-base flex flex-col gap-3">
                <p><strong>Kiểm tra hàng ngày để theo dõi tiến trình cai thuốc lá của bạn</strong></p>
                <p>
                    Việc kiểm tra giúp bạn nhanh chóng ghi lại tâm trạng bằng cách chọn một biểu tượng cảm xúc.
                    Bạn cũng có thể viết nhật ký để lưu lại cảm xúc và suy nghĩ của mình trong ngày.
                </p>
                <p><strong>Dòng thời gian</strong></p>
                <p>
                    Theo thời gian, bạn sẽ có thể xem lại những thông tin này để hiểu rõ hơn về các yếu tố ảnh
                    hưởng đến tâm trạng, cơn thèm thuốc và khả năng duy trì việc không hút thuốc. Bạn sẽ nhận ra
                    những chiến lược cai thuốc hiệu quả nhất với bản thân, thấy được sự thay đổi trong cảm xúc khi
                    kỹ năng cai thuốc của bạn được cải thiện, biết cách xử lý những lần tái nghiện và tiếp tục giữ vững
                    lối sống không thuốc lá.
                </p>
            </div>
        </div>
    );
};

export default AboutCheckin;