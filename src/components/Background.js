import React from "react";

const Background = () => {
  return (
    <div className="absolute inset-0 bg-black/70 -z-10 overflow-hidden">
      <div className="absolute w-[300px] h-[300px] bg-red-400/20 rounded-full top-[-150px] left-[-150px]"></div>

      {/* Forma fluida 2 */}
      <div className="absolute w-[300px] h-[300px] bg-pink-500/20 rounded-full bottom-[-150px] right-[-150px]"></div>
      {/* Forma fluida 2 em red-400 */}
      <div className="absolute w-[250px] h-[250px] bg-red-300 left-1/2 bottom-[-50px] transform -translate-x-1/2 heart"></div>
    </div>
  );
};

export default Background;
