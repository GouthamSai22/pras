import React, { useState, useEffect } from "react";
import "./viewCollected.css"; // import your custom styles
import CIcon from "@coreui/icons-react";
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
} from "@coreui/react";
import Webcam from "react-webcam";

const WebcamComponent = () => <Webcam />;
const videoConstraints = {
  width: 400,
  height: 400,
  facingMode: "user",
};

function viewUnCollected({}) {
  const [arrivalDate, setArrivalDate] = useState("");
  const [studentName, setStudentName] = useState("");
  const [parcelType, setParcelType] = useState("");
  const [postDetails, setPostDetails] = useState("");

  const [packages, setPackages] = useState([]);

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

  return (
    <div className="package-table">
      <h1>Uncollected Package Table</h1>
      <table>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Date of Arrival</th>
            <th>Name of Owner</th>
            <th>Package Number</th>
            <th>Type of Parcel</th>
            <th>Status</th>
            <th></th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {packages.map((pkg, index) => (
            <tr key={index + 1}>
              <td>{pkg.package_id}</td>
              <td>{pkg.arrival.slice(0, 10)}</td>
              <td>{pkg.owner_name}</td>
              <td>{pkg.package_number}</td>
              <td>{pkg.package_type}</td>
              <td>
                {pkg.status === 2
                  ? "Collected"
                  : pkg.status === 1
                  ? "Uncollected"
                  : "Expected"}
              </td>
              <td>
                <CTooltip content="Collect" placement="bottom">
                  <CButton
                    color="light"
                    onClick={() => setCollectVisible(!collectVisible)}
                  >
                    <CIcon icon={cilBarcode}></CIcon>
                    <CModal
                      alignment="center"
                      scrollable
                      visible={collectVisible}
                      onClose={() => setCollectVisible(false)}
                    >
                      <CModalHeader>
                        <CModalTitle>ID Card Scanner</CModalTitle>
                      </CModalHeader>
                      <CModalBody>
                        <p>Scan ID</p>
                        <CContainer>
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
                            <CButton color="primary" shape="rounded-pill">
                              Capture
                            </CButton>
                          </CRow>
                        </CContainer>
                      </CModalBody>
                      <CModalFooter>
                        <CButton
                          color="secondary"
                          onClick={() => setCollectVisible(false)}
                        >
                          Cancel
                        </CButton>

                        <CButton
                          color="primary"
                          onClick={() => setCollectVisible(false)}
                        >
                          Save
                        </CButton>
                      </CModalFooter>
                    </CModal>
                  </CButton>
                </CTooltip>
              </td>
              <td>
                <CTooltip content="Edit" placement="bottom">
                  <CButton
                    color="light"
                    onClick={() => setEditVisible(!editVisible)}
                  >
                    <CIcon icon={cilPencil}></CIcon>
                  </CButton>
                </CTooltip>
                <CModal
                  alignment="center"
                  scrollable
                  visible={editVisible}
                  onClose={() => setEditVisible(false)}
                >
                  <CModalHeader>
                    <CModalTitle>Edit Package Details</CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                    <p>Edit Details</p>
                    <CCard>
                      <CCardBody className="text-left">
                        <CForm className="parcel-search-container">
                          <h1>Add Package Details</h1>

                          <CCol md={6}>
                            <CFormInput
                              id="arrivalDate"
                              type="date"
                              value={pkg.arrival}
                              label="Arrival Date"
                              readOnly
                            />
                          </CCol>
                          <CCol md={6}>
                            <CFormInput
                              placeholder="Student Name"
                              id="studentName"
                              label="Student Name"
                              value={pkg.owner_name}
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
                              value={pkg.package_type}
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
                              placeholder="E.g.: 34429554513900"
                              label="Parcel Number"
                              value={pkg.package_number}
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
                              Add Package
                            </CButton>
                          </CCol>
                        </CForm>
                      </CCardBody>
                    </CCard>
                  </CModalBody>
                  <CModalFooter>
                    <CButton
                      color="secondary"
                      onClick={() => setEditVisible(false)}
                    >
                      Cancel
                    </CButton>

                    <CButton
                      color="primary"
                      onClick={() => setEditVisible(false)}
                    >
                      Save
                    </CButton>
                  </CModalFooter>
                </CModal>
              </td>
              <td>
                <CTooltip content="Delete" placement="bottom">
                  <CButton
                    color="light"
                    onClick={() => setDeleteVisible(!deleteVisible)}
                  >
                    <CIcon icon={cilTrash}></CIcon>
                    <CModal
                      alignment="center"
                      scrollable
                      visible={deleteVisible}
                      onClose={() => setDeleteVisible(false)}
                    >
                      <CModalHeader>
                        <CModalTitle>Delete Entry</CModalTitle>
                      </CModalHeader>
                      <CModalBody>
                        <p>Are you sure you want to delete this entry?</p>
                      </CModalBody>
                      <CModalFooter>
                        <CButton
                          color="secondary"
                          onClick={() => setDeleteVisible(false)}
                        >
                          Cancel
                        </CButton>

                        <CButton
                          color="primary"
                          onClick={() => setDeleteVisible(false)}
                        >
                          Delete
                        </CButton>
                      </CModalFooter>
                    </CModal>
                  </CButton>
                </CTooltip>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default viewUnCollected;
