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
import { useState } from "react";
import React from "react";

const barcodescanner = () => {
  // const history = useNavigate();

  const pkg = JSON.parse(localStorage.getItem("curr_row"));
  const [serialNumber, setSerialNumber] = useState(pkg.package_id);
  const [arrivalDate, setArrivalDate] = useState(pkg.arrival.slice(0, 10));
  const [studentName, setStudentName] = useState(pkg.owner_name);
  const [parcelType, setParcelType] = useState(pkg.package_type);
  const [postDetails, setPostDetails] = useState(pkg.package_number);
  const [packageStatus, setpackageStatus] = useState(pkg.status);
  // setArrivalDate(pkg.arrival);
  // setStudentName(pkg.owner_name);
  // setParcelType(pkg.package_type);
  // setPostDetails(pkg.package_number);
  // console.log(pkg);
  return (
    <CCard>
      <CCardBody className="text-left">
        <CForm className="parcel-search-container">
          <h1>Package Details</h1>
          <CCol md={6}>
            <CFormInput
              id="serialNumber"
              type="number"
              value={serialNumber}
              label="Package Number"
              readOnly
            />
          </CCol>
          <CCol md={6}>
            <CFormInput
              id="arrivalDate"
              type="date"
              value={arrivalDate}
              label="Arrival Date"
              onChange={(e) => {
                setArrivalDate(e.target.value); // update the state variable when the input changes
              }}
            />
          </CCol>
          <CCol md={6}>
            <CFormInput
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
            <CFormSelect
              id="inputState"
              label="Parcel Type"
              defaultValue={parcelType}
            >
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
              label="Parcel Number"
              value={postDetails}
              id="postDetails"
              type="text"
              onChange={(e) => {
                setPostDetails(e.target.value); // update the state variable when the input changes
              }}
            />
          </CCol>
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
          </CCol>
          <CCol xs={12}>
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
                  method: "POST",
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
                    // if (data["result"] === "success") {
                    //   <CAlert color="primary">Data added succesfully!</CAlert>;
                    // } else {
                    //   <CAlert color="primary">Error adding data!</CAlert>;
                    // }
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }}
            >
              Modify
            </CButton>
            <CButton
              onClick={() => {
                fetch("http://localhost:8000/delete-package", {
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
                    // if (data["result"] === "success") {
                    //   <CAlert color="primary">Data added succesfully!</CAlert>;
                    // } else {
                    //   <CAlert color="primary">Error adding data!</CAlert>;
                    // }
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }}
            >
              Delete
            </CButton>
            {packageStatus === 1 ? (
              <CButton
                onClick={() => {
                  fetch("http://localhost:8000/collect-package", {
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
                      // if (data["result"] === "success") {
                      //   <CAlert color="primary">Data added succesfully!</CAlert>;
                      // } else {
                      //   <CAlert color="primary">Error adding data!</CAlert>;
                      // }
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                }}
              >
                Delete
              </CButton>
            ) : (
              <></>
            )}
          </CCol>
        </CForm>
      </CCardBody>
    </CCard>
  );
};

export default barcodescanner;
