'use client';

import React from "react";

const LoadingLines: React.FC = () => {
  const letters = "Loading".split("");

  return (
    <div className="loading-lines-container relative flex items-center justify-center h-[140px] w-auto m-6 font-poppins text-[2.5em] sm:text-[3.2em] font-extrabold select-none tracking-wider scale-[1.2] sm:scale-[1.5]">
      {/* Animated letters */}
      {letters.map((letter, idx) => (
        <span
          key={idx}
          className="loading-letter relative inline-block opacity-0 z-[2] text-zinc-900 drop-shadow-sm font-bold"
          style={{ animationDelay: `${0.1 + idx * 0.105}s` }}
        >
          {letter}
        </span>
      ))}

      {/* Loader background */}
      <div className="loading-lines-mask absolute top-0 left-0 w-full h-full z-[1] bg-transparent">
        <div className="loading-lines-gradient absolute top-0 left-0 w-full h-full" />
      </div>
    </div>
  );
};

export default LoadingLines;
