import React from 'react';
import {DatePicker} from "antd";



const Test = () => {
    const onChange = (date, dateString) => {
        const dateArray = dateString.split('/');
        const UTCDate = `${dateArray[2]}-${dateArray[1]}-${dateArray[0]}T00:00:00Z`;

        const now = new Date(UTCDate);
        console.log(now.toISOString());
        console.log(now.toLocaleDateString('vi-VN'));
    };
    return (
        <div>
            <DatePicker onChange={onChange} format={'DD/MM/YYYY'}/>
        </div>
    );
};

export default Test;