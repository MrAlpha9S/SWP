import CustomButton from "./CustomButton.jsx";
import React from "react";

const ModalFooter = ({setIsModalOpen, onCancel}) => {

    return (
        <div className='flex gap-2 justify-end'>
            <CustomButton onClick={() => setIsModalOpen(false)}>Tôi đã hiểu</CustomButton>
            <CustomButton onClick={() => onCancel()} type='cancel'>Trở lại</CustomButton>
        </div>
    )
}

export default ModalFooter;