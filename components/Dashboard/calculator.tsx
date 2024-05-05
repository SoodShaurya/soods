'use client';

import React, { useState, ChangeEvent, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import * as math from 'mathjs';

const Calculator: React.FC = () => {
  const [expression, setExpression] = useState<string>('');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setExpression(e.target.value);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleEvaluate(); // Call evaluate when Enter is pressed
    }
  };

  const handleEvaluate = () => {
    try {
      const result = math.evaluate(expression).toString();
      setExpression(result);
    } catch (error) {
      setExpression('Error');
    }
  };

  const handleButtonClick = (value: string) => {
    setExpression((prev) => prev + value);
  };

  const handleClear = () => {
    setExpression('');
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-64">
        <Input
          value={expression}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress} // Listen for key presses
          className="w-full mb-4"
        />
        <div className="grid grid-cols-4 gap-2 mb-2">
          <Button variant="outline" onClick={() => handleButtonClick('(')}> ( </Button>
          <Button variant="outline" onClick={() => handleButtonClick(')')}> ) </Button>
          <Button variant="outline" onClick={() => handleButtonClick('sqrt(')}> √ </Button>
          <Button variant="destructive" onClick={handleClear}> Clear </Button>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {['7', '8', '9', '/'].map((item) => (
            <Button
              key={item}
              variant="outline"
              onClick={() => handleButtonClick(item)}
            >
              {item === '/' ? '÷' : item}
            </Button>
          ))}
          {['4', '5', '6', '*'].map((item) => (
            <Button
              key={item}
              variant="outline"
              onClick={() => handleButtonClick(item)}
            >
              {item === '*' ? '×' : item}
            </Button>
          ))}
          {['1', '2', '3', '-'].map((item) => (
            <Button
              key={item}
              variant="outline"
              onClick={() => handleButtonClick(item)}
            >
              {item}
            </Button>
          ))}
          <Button variant="outline" onClick={() => handleButtonClick('0')}> 0 </Button>
          <Button variant="outline" onClick={() => handleButtonClick('.')}> . </Button>
          <Button variant="outline" onClick={handleEvaluate}> = </Button>
          <Button variant="outline" onClick={() => handleButtonClick('+')}> + </Button>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
