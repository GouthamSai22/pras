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
    
    
  }

  const [filterType, setFilterType] = useState("");
  const [filterKeyword, setFilterKeyword] = useState("");
  const [editVisible, setEditVisible] = useState(false);

  const [packages, setPackages] = useState([]);

  const getpackages = async () => {
    const packageres = await fetch("http://localhost:8000/packages", {
      method: "GET",
    });
    const data = await packageres.json();
    setPackages(data);
  };

  useEffect(() => {
    getpackages();
  }, []);

  // const isAdmin = true;
  const isAdmin = JSON.parse(localStorage.getItem("isAdmin"));

  function handleSearchClick() {
    fetch("http://localhost:8000/filter-packages", {
      headers: {
        // Authorization: credentialResponse.credential,
        'Content-type' : 'application/json'
      },
      body: {
        filter: filterType,
        value: filterKeyword,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setPackages(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return (
    <div>
      <CForm className="row g-3">
        <CCol lg={6}>
          <CFormInput
            type="text"
            id="keyword"
            placeholder="Keyword"
            label="Search for"
            value={filterKeyword}
            onChange={(e) => {
              setFilterKeyword(e.target.value);
            }}
          />
        </CCol>
        <CCol lg={4}>
          <CFormSelect
            id="searchby"
            label="Search By"
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
            }}
          >
            <option>Search By</option>
            <option>Package Number</option>
            <option>Package Type</option>
            <option>Owner Name</option>
            <option>Arrival Date</option>
          </CFormSelect>
        </CCol>
        <CCol lg={2}>
          <CButton type="submit" onClick={handleSearchClick}>
            Search
          </CButton>
        </CCol>
      </CForm>
      <div className="package-table">
        <h1> View All Packages </h1>
        <table>
          <thead>
            <tr>
              <th> S.No </th>
              <th> Date of Arrival </th>
              <th> Name of Owner </th>
              <th> Package Number </th>
              <th> Type of Parcel </th>
              <th> Status </th>
              <th> Collected By</th>
              <th> Collected On</th>
              {isAdmin && <th> </th>}
            </tr>
          </thead>
          <tbody>
            {packages.map((pkg, index) => (
              <tr key={index + 1}>
                <td> {pkg.package_id} </td>
                <td> {pkg.arrival.slice(0, 10)} </td>
                <td> {pkg.owner_name} </td>
                <td> {pkg.package_number} </td>
                <td> {pkg.package_type} </td>
                <td>
                  {pkg.status === 2
                    ? "Collected"
                    : pkg.status === 1
                    ? "Uncollected"
                    : "Expected"}
                </td>
                <td>{pkg.collected_by_email ? pkg.collected_by_email : "-"}</td>
                <td>
                  {pkg.collection_time ? pkg.collection_time.slice(0, 10) : "-"}
                </td>
                {isAdmin && (
                  <td>
                    <CNavLink to="/barcode" component={NavLink}>
                      <CTooltip content="Edit" placement="bottom">
                        <CButton
                          color="light"
                          onClick={() => {
                            // console.log(pkg);
                            localStorage.setItem(
                              "curr_row",
                              JSON.stringify(pkg)
                            );
                            // console.log(localStorage.getItem("curr_row"));
                          }}
                        >
                          <CIcon icon={cilPencil}></CIcon>
                        </CButton>
                      </CTooltip>
                    </CNavLink>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default viewAll;
