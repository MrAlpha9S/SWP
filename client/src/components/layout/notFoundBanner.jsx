import React from 'react';
import {Result, Typography} from "antd";

const NotFoundBanner = ({title, content}) => {
    const {Title, Paragraph} = Typography
    return (
        <div className='flex flex-col md:flex-row items-center justify-center gap-5 w-full p-14'>
            <div className='w-[60%] flex flex-col items-center md:items-start gap-10'>
                <h2 className='md:text-4xl lg:text-5xl font-bold'>
                    {title}
                </h2>
                {content}
            </div>
            <Result
                status={404}
                title={
                    <Title
                        level={1}
                        className="!text-gray-800 !mb-4 text-2xl md:text-3xl lg:text-4xl font-bold"
                    />
                }
                subTitle={
                    <Paragraph className="!text-gray-600 !text-lg md:!text-xl !mb-8 leading-relaxed"/>
                }
                className="!p-0"
            />
        </div>
    );
};

export default NotFoundBanner;