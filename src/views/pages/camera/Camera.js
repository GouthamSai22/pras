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
import React, { useState, useEffect } from "react";
import Webcam from "react-webcam";
import JsonFile from "../package/data.json";

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
  // const isAdmin = false;
  const isAdmin = JSON.parse(localStorage.getItem("isAdmin"));
  
  return (
    isAdmin && <CContainer>
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
                  onClick={async () => {
                    const res = await fetch("http://localhost:8000/camera", {
                      method: "POST",
                      headers: {
                        // Authorization: credentialResponse.credential,
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({ pic: picture }),
                    });
                    // .then((res) => res.json())
                    data = await res.json();
                    // .then((data) => {
                    setStudentName(data[owner_name]);
                    setPostDetails(data[package_number]);
                    // });
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
          <CCardBody className="text-left">
            <CForm className="parcel-search-container">
              <h1>Add Package Details</h1>

              <CCol md={6}>
                <CFormInput
                  id="arrivalDate"
                  type="date"
                  value={new Date().toISOString().slice(0, 10)}
                  label="Arrival Date"
                  onChange={(e) => {
                    setArrivalDate(e.target.value); // update the state variable when the input changes
                  }}
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  placeholder="Student Name"
                  id="studentName"
                  label="Student Name"
                  value={studentName}
                  type="text"
                  onChange={(e) => {
                    setStudentName(e.target.value); // update the state variable when the input changes
                  }}
                />
              </CCol>
              <CCol md={4}>
                <CFormSelect id="inputState" label="Parcel Type">
                  <option>Choose Type</option>
                  <option>Amazon</option>
                  <option>Flipkart</option>
                  <option>Myntra</option>
                  <option>Nykaa</option>
                  <option>BlueDart</option>
                  <option>Amazon</option>
                  <option>Speed Post</option>
                  onChange=
                  {(e) => {
                    setParcelType(e.target.value); // update the state variable when the input changes
                  }}
                </CFormSelect>
              </CCol>
              <CCol md={6}>
                <CFormInput
                  placeholder="E.g.: 34429554513900"
                  label="Parcel Number"
                  value={postDetails}
                  id="postDetails"
                  type="text"
                  onChange={(e) => {
                    setPostDetails(e.target.value); // update the state variable when the input changes
                  }}
                />
              </CCol>
              <CCol xs={12}>
                <CButton
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
                        {
                          data["result"] === "success" ? (
                            <CAlert color="primary">
                              Data added succesfully!
                            </CAlert>
                          ) : (
                            <CAlert color="primary">error adding data!</CAlert>
                          );
                        }
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                  }}
                >
                  Add Package
                </CButton>
              </CCol>
            </CForm>
          </CCardBody>
        </CCard>
      </CCardGroup>
    </CContainer>
  );
};
export default Camera;

// import React, { useState } from 'react'
// import { CAlert } from '@coreui/react'

// const TableExample = () => {
//   const [data, setData] = useState([
//     // some JSON data
//   ])

//   const [selectedRow, setSelectedRow] = useState(null)

//   const handleRowClick = (row, e) => {
//     // set the selected row state
//     setSelectedRow(row)
//   }

//   return (
//     <div>
//       <table>
//         <thead>
//           <tr>
//             {/* some table headers */}
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((row) => (
//             <tr
//               key={row.id}
//               // pass the callback function to the onRowClicked prop
//               onRowClicked={(e) => handleRowClick(row, e)}
//             >
//               {/* some table cells */}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       {selectedRow && (
//         // show an alert with the selected row data
//         <CAlert color="primary">
//           You selected row with id: {selectedRow.id}
//         </CAlert>
//       )}
//     </div>
//   )
// }

// export default TableExample
