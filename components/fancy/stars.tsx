import React, { useState, useEffect } from 'react';

const styles = `
  .star {
    position: absolute;
    width: 2px;
    height: 2px;
    border-radius: 5px;
  }

  @keyframes twinkle {
    0% {
      transform: scale(1, 1);
      background: rgba(255, 255, 255, 0);
      animation-timing-function: linear;
    }
    40% {
      transform: scale(0.8, 0.8);
      background: rgba(255, 255, 255, 1);
      animation-timing-function: ease-out;
    }
    80% {
      background: rgba(255, 255, 255, 0);
      transform: scale(1, 1);
    }
    100% {
      background: rgba(255, 255, 255, 0);
      transform: scale(1, 1);
    }
  }
`;

const Stars = () => {
  const [stars, setStars] = useState<React.ReactElement[]>([]);

  useEffect(() => {
    const newStars = [];
    const scrollHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.body.clientHeight,
      document.documentElement.clientHeight
    ) || window.innerHeight;

    for (let i = 0; i < 100; i++) {
      const star = (
        <div
          className="star m-0"
          style={{
            animation: `twinkle ${Math.random() * 5 + 5}s linear ${
              Math.random() * 1 + 1
            }s infinite`,
            top: `${Math.random() * (scrollHeight * 0.9)}px`, // Reduce the top position by 10%
            left: `${Math.random() * window.innerWidth}px`,
          }}
        />
      );
      newStars.push(star);
    }

    setStars(newStars);
  }, []);

  return (
    <>
      <style>{styles}</style>
      {stars}
    </>
  );
};

export default Stars;