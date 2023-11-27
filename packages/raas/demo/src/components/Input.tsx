import React, { useState } from 'react';

const DisplayInputComponent: React.FC = () => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  return (
    <div>
      <input type="text" value={inputValue} onChange={handleInputChange} />
      <p>{inputValue}</p>
    </div>
  );
};

export default DisplayInputComponent;
