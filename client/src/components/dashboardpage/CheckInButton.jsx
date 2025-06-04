import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook

function CheckInButton() {
  const navigate = useNavigate(); // Initialize the navigate function

  const handleClick = () => {
    // This function will be called when the button is clicked
    navigate('/dashboard/check-in'); // Navigate to the desired path
  };

  return (
    <button onClick={handleClick} class="bg-primary-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-800">
      Daily check-in →
    </button>
  );
}

export default CheckInButton;