import React from "react";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
});

const PaperPlaneAnimation = () => {
  return (
    <div className="mb-5 flex justify-center">
      <Lottie
        animationData={require("/public/animations/paperplane.json")}
        style={{ height: "100px", width: "100px" }}
        loop={true}
        autoplay={true}
      />
    </div>
  );
};

export default PaperPlaneAnimation;
