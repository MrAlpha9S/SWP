import CustomButton from "./CustomButton.jsx";
import React from "react";
import { useNavigate } from "react-router-dom";

const ModalFooter = ({setIsModalOpen}) => {
    const navigate = useNavigate();
    return (
        <div className='flex gap-2 justify-end'>
            <CustomButton onClick={() => setIsModalOpen(false)}>Tôi đã hiểu</CustomButton>
            <CustomButton onClick={() => navigate('/')} type='cancel'>Trở lại</CustomButton>
        </div>
    )
}

export default ModalFooter;