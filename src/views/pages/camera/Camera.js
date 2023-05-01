import {
  CButton,
  CContainer,
  CCol,
  CRow,
  CCard,
  CForm,
  CCardGroup,
  CCardBody,
  CInputGroup,
  CInputGroupText,
  CFormInput,
} from "@coreui/react";
import React, { useState, useEffect } from "react";
import Webcam from "react-webcam";
import JsonFile from "../package/data.json"


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
    const formData = new FormData();
    formData.append('picture', picture);
  }, [picture]);

  const webcamRef = React.useRef(null);
  const capture = React.useCallback(() => {
    const pictureSrc = webcamRef.current.getScreenshot();
    setPicture(pictureSrc);
    console.log("saving...");
    console.log(typeof localStorage.getItem("capturedImage"));
  });

  const [arrivalDate, setArrivalDate] = useState("");
  const [studentName, setStudentName] = useState("");
  const [parcelType, setParcelType] = useState("");
  const [postDetails, setPostDetails] = useState("");

  const handleSearch = () => {
    // Handle search logic here, using the current values of the form fields
    console.log("Searching for parcel with the following details:");
    console.log(`Arrival date: ${arrivalDate}`);
    console.log(`Student name: ${studentName}`);
    console.log(`Parcel type: ${parcelType}`);
    console.log(`Post details: ${postDetails}`);
  };
  return (
    <CContainer>
      <CCardGroup>
        {picture == "" ? (
          <CCard className="p-4">
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
            <CRow className="justify-content-center">
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
          </CCard>
        ) : (
          <CCard className="p-4">
            <center>
              <img src={picture} height="80%" width="70%" />
            </center>
            <CRow className="justify-content-center">
              <CCol className="justify-content-center">
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
                    fetch("http://localhost:8000/camera", {
                      method: "POST",
                      headers: {
                        // Authorization: credentialResponse.credential,
                        "Content-Type" : "application/json"
                      },
                      body: JSON.stringify({pic : picture})
                    });
                  }}
                  color="primary"
                >
                  Proceed
                </CButton>
              </CCol>
            </CRow>
          </CCard>
        )}
        <CCard>
          <CCardBody className="text-center">
            <CForm className="parcel-search-container">
              <h1>Add Package Details</h1>
              <CInputGroup>
                <CInputGroupText>Date of Arrival</CInputGroupText>
                <CFormInput
                  id="arrivalDate"
                  type="date"
                  onChange={(e) => {
                    setArrivalDate(e.target.value); // update the state variable when the input changes
                  }}
                />
              </CInputGroup>
              <CInputGroup>
                <CInputGroupText>Student Name</CInputGroupText>
                <CFormInput
                  placeholder="Student Name"
                  id="studentName"
                  type="text"
                  onChange={(e) => {
                    setStudentName(e.target.value); // update the state variable when the input changes
                  }}
                />
              </CInputGroup>
              <CInputGroup>
                <CInputGroupText>Type of Parcel</CInputGroupText>
                <CFormInput
                  placeholder="Type of Parcel"
                  id="parcelType"
                  type="text"
                  onChange={(e) => {
                    setParcelType(e.target.value); // update the state variable when the input changes
                  }}
                />
              </CInputGroup>
              <CInputGroup>
                <CInputGroupText>Post Details:</CInputGroupText>
                <CFormInput
                  placeholder="Post Details:"
                  id="postDetails"
                  type="text"
                  onChange={(e) => {
                    setPostDetails(e.target.value); // update the state variable when the input changes
                  }}
                />
              </CInputGroup>
              <CButton className="search-button" onClick={handleSearch}>
                Add Package
              </CButton>
            </CForm>
          </CCardBody>
        </CCard>
      </CCardGroup>
    </CContainer>
  );
};
export default Camera;