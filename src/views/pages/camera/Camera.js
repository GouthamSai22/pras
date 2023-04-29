import React, { useState, useEffect } from "react";
import Webcam from "react-webcam";
const WebcamComponent = () => <Webcam />;
const videoConstraints = {
  width: 400,
  height: 400,
  facingMode: "user",
};
const Camera = () => {
  const [picture, setPicture] = useState("");

  useEffect(() => {
    localStorage.setItem("capturedImage", JSON.stringify(picture));
  }, [picture]);

  const webcamRef = React.useRef(null);
  const capture = React.useCallback(() => {
    const pictureSrc = webcamRef.current.getScreenshot();
    setPicture(pictureSrc);
    console.log("saving...");
    console.log(typeof picture);
  });
  return (
    <div>
      <h2 className="mb-5 text-center">
        React Photo Capture using Webcam Examle
      </h2>
      <div>
        {picture == "" ? (
          <center>
            <Webcam
              audio={false}
              height={400}
              ref={webcamRef}
              width={400}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
            />
          </center>
        ) : (
          <center>
            <img src={picture} />
          </center>
        )}
      </div>
      <div>
        {picture != "" ? (
          <center>
            <button
              onClick={(e) => {
                e.preventDefault();
                setPicture();
              }}
              className="btn btn-primary"
            >
              Retake
            </button>
          </center>
        ) : (
          <center>
            <button
              onClick={(e) => {
                e.preventDefault();
                capture();
              }}
              className="btn btn-danger"
            >
              Capture
            </button>
          </center>
        )}
      </div>
    </div>
  );
};
export default Camera;
