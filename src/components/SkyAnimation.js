// components/SkyAnimation.js
import React from "react";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
});

const SkyAnimation = () => {
  return (
    <div className="mb-5 flex justify-center">
      <Lottie
        animationData={require("/public/animations/sky.json")}
        style={{ height: "200px", width: "200px" }}
        loop={true}
        autoplay={true}
      />
    </div>
  );
};

export default SkyAnimation;
