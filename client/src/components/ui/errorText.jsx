import React from 'react';

const ErrorText = ({children}) => {
    return (
        <p className="text-red-500 text-xs md:text-sm">{children}</p>
    );
};

export default ErrorText;