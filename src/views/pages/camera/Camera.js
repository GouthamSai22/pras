import { CButton, CContainer, CCol, CRow } from "@coreui/react";
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
    <CContainer fluid>
      <h2 className="mb-5 text-center">
        React Photo Capture using Webcam Examle
      </h2>

      {picture == "" ? (
        <CContainer fluid>
          <CRow>
            <Webcam
              audio={false}
              height={400}
              ref={webcamRef}
              width={400}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
            />
          </CRow>
          <CRow>
            <CButton
              onClick={(e) => {
                e.preventDefault();
                capture();
              }}
              color="danger"
              size="sm"
            >
              Capture
            </CButton>
          </CRow>
        </CContainer>
      ) : (
        <CContainer fluid >
          <CRow>
            <img src={picture} />
          </CRow>
          <CRow>
            <CButton
              onClick={(e) => {
                e.preventDefault();
                setPicture("");
              }}
              color="primary"
            >
              Retake
            </CButton>
          </CRow>
          <CRow>
            <CButton
              onClick={() => {
                console.log("Successfully taken photo!");
              }}
              color="primary"
            >
              Proceed
            </CButton>
          </CRow>
        </CContainer>
      )}
    </CContainer>
  );
};
export default Camera;
