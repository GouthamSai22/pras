import React, { useState, useEffect } from "react";
import "./viewCollected.css"; // import your custom styles
import CIcon from "@coreui/icons-react";
import { NavLink, Navigate, useNavigate } from "react-router-dom";
import { cilBarcode, cilPencil, cilTrash } from "@coreui/icons";
import {
  CButton,
  CTooltip,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CAlert,
  CContainer,
  CCard,
  CCardBody,
  CForm,
  CFormInput,
  CFormSelect,
  CCol,
  CRow,
  CNavLink,
  CNav,
} from "@coreui/react";
import Webcam from "react-webcam";

const WebcamComponent = () => <Webcam />;
const videoConstraints = {
  width: 400,
  height: 400,
  facingMode: "user",
};

function viewAll() {
  const [rowData, setRowData] = useState([]);

  function handleEditClick() {
    setEditVisible(!editVisible);
    setRowData(pkg);
    const [arrivalDate, setArrivalDate] = useState(
      rowData.arrival.slice(0, 10)
    );
    const [studentName, setStudentName] = useState(rowData.owner_name);
    const [parcelType, setParcelType] = useState(rowData.package_type);
    const [postDetails, setPostDetails] = useState(rowData.package_number);

    return (
      <CModal
        alignment="center"
        scrollable
        visible={editVisible}
        onClose={() => setEditVisible(false)}
      >
        <CModalHeader>
          <CModalTitle> Edit Package Details </CModalTitle>{" "}
        </CModalHeader>{" "}
        <CModalBody>
          <p> Edit Details </p>{" "}
          <CCard>
            <CCardBody className="text-left">
              <CForm className="parcel-search-container">
                <h1> Add Package Details </h1>
                <CCol md={6}>
                  <CFormInput
                    id="arrivalDate"
                    type="date"
                    value={arrivalDate}
                    label="Arrival Date"
                    readOnly
                  />
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
                    value={parcelType}
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
                <CCol xs={12}>
                  <CButton
                    type="submit"
                    onClick={() => {
                      fetch("http://localhost:8000/edit-package", {
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
                      });
                      console.log(postDetails);
                    }}
                  >
                    Add Package{" "}
                  </CButton>{" "}
                </CCol>{" "}
              </CForm>{" "}
            </CCardBody>{" "}
          </CCard>{" "}
        </CModalBody>{" "}
        <CModalFooter>
          <CButton color="secondary" onClick={() => setEditVisible(false)}>
            Cancel{" "}
          </CButton>
          <CButton color="primary" onClick={() => setEditVisible(false)}>
            Save{" "}
          </CButton>{" "}
        </CModalFooter>{" "}
      </CModal>
    );
  }

  // const [packages, setPackages] = useState([]);

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
  const [collectVisible, setCollectVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);

  const [delAlertVisible, setDelAlertVisible] = useState(false);

  // const getpackages = async () => {
  //   const packageres = await fetch("http://localhost:8000/packages", {
  //     method: "GET",
  //   });
  //   const data = await packageres.json();
  //   setPackages(data);
  // };

  const packages = [
    {
      package_id: 1,
      package_number: "AWB1002",
      status: 0,
      owner_name: "Vikhyath Sai Kothamasu",
      package_type: "Amazon",
      arrival: "2023-04-23T15:39:49.046959",
      collection_time: "2023-04-23T15:41:25.323116",
      collected_by_email: "cs20btech11056@iith.ac.in",
      observer: null,
    },
    {
      package_id: 2,
      package_number: "AWB1003",
      status: 1,
      owner_name: "Goutham Sai",
      package_type: "Amazon",
      arrival: "2023-05-02T01:18:39.394319",
      collection_time: null,
      collected_by_email: null,
      observer: null,
    },
  ];

  // const isAdmin = false;
  const isAdmin = JSON.parse(localStorage.getItem("isAdmin"));

  return (
    <div className="package-table">
      <h1> View All Packages </h1>{" "}
      <table>
        <thead>
          <tr>
            <th> S.No </th> <th> Date of Arrival </th> <th> Name of Owner </th>{" "}
            <th> Package Number </th> <th> Type of Parcel </th>{" "}
            <th> Status </th> <th> </th> <th> </th> <th> </th>{" "}
          </tr>{" "}
        </thead>{" "}
        <tbody>
          {" "}
          {packages.map((pkg, index) => (
            <tr key={index + 1}>
              <td> {pkg.package_id} </td> <td> {pkg.arrival.slice(0, 10)} </td>{" "}
              <td> {pkg.owner_name} </td> <td> {pkg.package_number} </td>{" "}
              <td> {pkg.package_type} </td>{" "}
              <td>
                {" "}
                {pkg.status === 2
                  ? "Collected"
                  : pkg.status === 1
                  ? "Uncollected"
                  : "Expected"}{" "}
              </td>{" "}
              {isAdmin && (
                <td>
                  <CNavLink to="/barcode" component={NavLink}>
                  <CTooltip content="Edit" placement="bottom">
                  <CButton color="light" onClick={() => {
                          // console.log(pkg);
                          localStorage.setItem("curr_row", JSON.stringify(pkg));
                          // console.log(localStorage.getItem("curr_row"));
                        }}>
                    <CIcon icon={cilPencil}></CIcon>
                  </CButton>
                </CTooltip>
                </CNavLink>{" "}
                </td>
              )}{" "}
            </tr>
          ))}{" "}
        </tbody>{" "}
      </table>{" "}
    </div>
  );
}

export default viewAll;
