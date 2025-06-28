import React from 'react';

const PremiumBadge = ({className}) => {
    return (
        <div className={` ${className && className} h-5 p-1 bg-warning-200 rounded-lg flex justify-center items-center`}>
            <p className='text-xs text-black'>Premium</p>
        </div>
    );
};

export default PremiumBadge;