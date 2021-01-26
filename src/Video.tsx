import * as React from "react";

const Video = () => {
  const videoRef = React.useRef();
  React.useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      });
  }, []);
  return (
    <video
      ref={videoRef}
      style={{ transform: "scale(-1, 1)" }}
      width="300"
      height="150"
    />
  );
};

export default Video;
