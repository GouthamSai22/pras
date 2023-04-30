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
        <CContainer fluid>
          <center>
            <img src={picture} height="50%" width="50%" />
          </center>
          <CRow>
            <CCol>
              <CButton
                onClick={(e) => {
                  e.preventDefault();
                  setPicture("");
                }}
                color="primary"
              >
                Retake
              </CButton>
            </CCol>
            <CCol>
              <CButton
                onClick={() => {
                  console.log("Successfully taken photo!");
                  // ********************** Have to change the route later *********************************
                  fetch("http://localhost:8000/auth", {
                    method: 'POST',
                    headers: {
                      Authorization: credentialResponse.credential,
                      'Content-Type': 'application/json'
                    },
                    body : localStorage.getItem("capturedImage")
                  });
                }}
                color="primary"
              >
                Proceed
              </CButton>
            </CCol>
          </CRow>
        </CContainer>
      )}
    </CContainer>
  );
};
export default Camera;
