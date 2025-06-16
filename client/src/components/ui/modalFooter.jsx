import CustomButton from "./CustomButton.jsx";
import React from "react";

const ModalFooter = ({onOk, onCancel, okText, okButtonType = null, cancelText}) => {

    return (
        <div className='flex gap-2 justify-end'>
            <CustomButton type={okButtonType === 'danger' ? 'cancel' : 'primary'} onClick={() => onOk()}>{okText}</CustomButton>
            <CustomButton onClick={() => onCancel()} type='cancel'>{cancelText}</CustomButton>
        </div>
    )
}

export default ModalFooter;