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
  CFormSelect,
} from "@coreui/react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Webcam from "react-webcam";
import React from "react";

const WebcamComponent = () => <Webcam />;
const videoConstraints = {
  width: 400,
  height: 400,
  facingMode: "user",
};

const barcodescanner = () => {
  const [picture, setPicture] = useState("");

  useEffect(() => {
    localStorage.setItem("capturedImage", JSON.stringify(picture));
  }, [picture]);

  const webcamRef = React.useRef(null);
  const capture = React.useCallback(() => {
    const pictureSrc = webcamRef.current.getScreenshot();
    setPicture(pictureSrc);
    console.log("saving...");
    console.log(typeof localStorage.getItem("capturedImage"));
  });

  const pkg = JSON.parse(localStorage.getItem("curr_row"));
  const [serialNumber, setSerialNumber] = useState(pkg.package_id);
  const [arrivalDate, setArrivalDate] = useState(pkg.arrival.slice(0, 10));
  const [studentName, setStudentName] = useState(pkg.owner_name);
  const [parcelType, setParcelType] = useState(pkg.package_type);
  const [postDetails, setPostDetails] = useState(pkg.package_number);
  const [packageStatus, setpackageStatus] = useState(pkg.status);

  // const isAdmin = false;
  const isAdmin = localStorage.getItem("isAdmin");

  return (
    isAdmin && <CCardGroup>
      <CCard>
        <CCardBody className="text-left">
          <CForm className="parcel-search-container">
            <h1> Package Details </h1>{" "}
            <CCol md={6}>
              <CFormInput
                id="serialNumber"
                type="number"
                value={serialNumber}
                label="Package Number"
                readOnly
              />
            </CCol>{" "}
            <CCol md={6}>
              <CFormInput
                id="arrivalDate"
                type="date"
                value={arrivalDate}
                label="Arrival Date"
                onChange={(e) => {
                  setArrivalDate(e.target.value); // update the state variable when the input changes
                }}
              />{" "}
            </CCol>{" "}
            <CCol md={6}>
              <CFormInput
                id="studentName"
                label="Student Name"
                value={studentName}
                type="text"
                onChange={(e) => {
                  setStudentName(e.target.value); // update the state variable when the input changes
                }}
              />{" "}
            </CCol>{" "}
            <CCol md={4}>
              <CFormSelect
                id="inputState"
                label="Parcel Type"
                defaultValue={parcelType}
              >
                <option> Choose Type </option> <option> Amazon </option>{" "}
                <option> Flipkart </option> <option> Myntra </option>{" "}
                <option> Nykaa </option> <option> BlueDart </option>{" "}
                <option> Amazon </option> <option> Speed Post </option>
                onChange ={" "}
                {(e) => {
                  setParcelType(e.target.value); // update the state variable when the input changes
                }}{" "}
              </CFormSelect>{" "}
            </CCol>{" "}
            <CCol md={6}>
              <CFormInput
                label="Parcel Number"
                value={postDetails}
                id="postDetails"
                type="text"
                onChange={(e) => {
                  setPostDetails(e.target.value); // update the state variable when the input changes
                }}
              />{" "}
            </CCol>{" "}
            <CCol md={6}>
              <CFormInput
                label="Collection Status"
                value={
                  packageStatus === 2
                    ? "Collected"
                    : packageStatus === 1
                    ? "Uncollected"
                    : "Expected"
                }
                id="package status"
                type="text"
                readOnly
              />
            </CCol>{" "}
            <CCol xs={12}>
              {" "}
              {/* <CButton
                          type="submit"
                          onClick={() => {
                            fetch("http://localhost:8000/add-package", {
                              method: "POST",
                              headers: {
                                // Authorization: credentialResponse.credential,
                                "Content-Type": "application/json",
                              },
                              body: JSON.stringify({
                                package_number: postDetails,
                                package_type: parcelType,
                                owner_name: studentName,
                              }),
                            })
                              .then((res) => res.json())
                              .then((data) => {
                                if (data["result"] === "success") {
                                  <CAlert color="primary">Data added succesfully!</CAlert>;
                                } else {
                                  <CAlert color="primary">Error adding data!</CAlert>;
                                }
                              })
                              .catch((err) => {
                                console.log(err);
                              });
                          }}
                        >
                          Add Package
                        </CButton> */}
              <CButton
                onClick={() => {
                  fetch("http://localhost:8000/modify-package", {
                    method: "BATCH",
                    headers: {
                      // Authorization: credentialResponse.credential,
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      package_id: serialNumber,
                      package_number: postDetails,
                      package_type: parcelType,
                      owner_name: studentName,
                      status: packageStatus,
                    }),
                  })
                    .then((res) => res.json())
                    .then((data) => {
                      console.log(data["result"]);
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                }}
              >
                Modify{" "}
              </CButton>{" "}
              <CButton
                onClick={() => {
                  fetch("http://localhost:8000/delete-package", {
                    method: "DELETE",
                    headers: {
                      // Authorization: credentialResponse.credential,
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      package_id: serialNumber,
                    }),
                  })
                    .then((res) => res.json())
                    .then((data) => {
                      console.log(data["result"]);
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                }}
              >
                Delete{" "}
              </CButton>{" "}
            </CCol>{" "}
          </CForm>{" "}
        </CCardBody>{" "}
      </CCard>{" "}
      {packageStatus === 1 ? (
        <CCard>
          {" "}
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
                />{" "}
              </CRow>{" "}
              <CRow className="justify-content-center">
                <CButton
                  onClick={(e) => {
                    e.preventDefault();
                    capture();
                  }}
                  color="danger"
                  size="sm"
                >
                  Capture{" "}
                </CButton>{" "}
              </CRow>{" "}
            </CCard>
          ) : (
            <CCard className="p-4">
              <center>
                <img src={picture} height="80%" width="70%" />
              </center>{" "}
              <CRow className="justify-content-center">
                <CCol className="justify-content-center">
                  <CButton
                    onClick={(e) => {
                      e.preventDefault();
                      setPicture("");
                    }}
                    color="primary"
                  >
                    Retake{" "}
                  </CButton>{" "}
                </CCol>{" "}
                <CCol>
                  <CButton
                    onClick={async () => {
                      const res = await fetch(
                        "http://localhost:8000/collect-package",
                        {
                          method: "POST",
                          headers: {
                            // Authorization: credentialResponse.credential,
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            pic: picture,
                            package_id: serialNumber,
                          }),
                        }
                      );
                      data = await res.json();
                      console.log(data["result"]);
                    }}
                    color="primary"
                  >
                    Proceed{" "}
                  </CButton>{" "}
                </CCol>{" "}
              </CRow>{" "}
            </CCard>
          )}{" "}
        </CCard>
      ) : (
        <> </>
      )}{" "}
    </CCardGroup>
  );
};

export default barcodescanner;
