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

function viewUnCollected({}) {
  //modals
  const [collectVisible, setCollectVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);

  // row specific
  const [collectPkg, setCollectPkg] = useState([]);
  const [selectedColRow, setSelectedColRow] = useState(null);

  const [editPkg, setEditPkg] = useState([]);
  const [selectedEditRow, setSelectedEditRow] = useState(null);

  const [deletePkg, setDeletePkg] = useState([]);
  const [selectedDelRow, setSelectedDelRow] = useState(null);

  //onclick and submit functions

  // collect
  const handleCollect = (e) => {
    console.log("COLLECT ME");
    console.log(e);
    setSelectedColRow(e);
    setCollectVisible(!collectVisible);
  };

  const handleCollectModalSubmit = () => {
    console.log("sel:", selectedColRow.package_id);
    setCollectPkg(selectedColRow);

    fetch("http://localhost:8000/collect-package", {
      method: "POST",
      headers: {
        // Authorization: credentialResponse.credential,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        col_package_id: selectedColRow.package_id,
      }),
    })
      .then((res) => res.json())
      .catch((err) => {
        console.log(err);
      });

    setCollectVisible(false);
    console.log("modal submit");
  };

  // edit
  const handleEdit = (e) => {
    console.log("EDIT ME");
    console.log(e);
    setSelectedEditRow(e);
    setEditVisible(!editVisible);
  };

  const handleEditModalSubmit = () => {
    console.log("sel:", selectedEditRow.package_id);
    setEditPkg(selectedEditRow);

    fetch("http://localhost:8000/modify-package", {
      method: "POST",
      headers: {
        // Authorization: credentialResponse.credential,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        edit_package_id: selectedEditRow.package_id,
        package_number: postDetails,
        package_type: parcelType,
        owner_name: studentName,
      }),
    })
      .then((res) => res.json())
      .catch((err) => {
        console.log(err);
      });
    setEditVisible(false);
    console.log("modal submit");
  };

  // delete
  const handleDelete = (e) => {
    console.log("DELETE ME");
    console.log(e);
    setSelectedDelRow(e);
    setDeleteVisible(!deleteVisible);
  };

  const handleDeleteModalSubmit = () => {
    console.log("sel:", selectedDelRow.package_id);
    setDeletePkg(selectedDelRow);
    console.log("del:", deletePkg.package_id);

    fetch("http://localhost:8000/delete-package", {
      method: "POST",
      headers: {
        // Authorization: credentialResponse.credential,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        del_package_id: selectedDelRow.package_id,
        // del_package_details: selectedDelRow.postDetails,
      }),
    })
      .then((res) => res.json())
      .catch((err) => {
        console.log(err);
      });

    setDeleteVisible(false);
    console.log("modal submit");
  };

  const [delAlertVisible, setDelAlertVisible] = useState(false);

  const [arrivalDate, setArrivalDate] = useState("");
  const [studentName, setStudentName] = useState("");
  const [parcelType, setParcelType] = useState("");
  const [postDetails, setPostDetails] = useState("");

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
      package_type: "amazon",
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
      package_type: "amazon",
      arrival: "2023-05-02T01:18:39.394319",
      collection_time: null,
      collected_by_email: null,
      observer: null,
    },
  ];

  const history = useNavigate();
  // useEffect(() => {
  //   getpackages();
  // }, []);

  const [visible, setVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  function handleCloseModal() {
    setShowModal(false);
  }
  function handleShowModal() {
    setShowModal(true);
  }

  return (
    <div className="package-table">
      <h1>Uncollected Package Table</h1>
      {/* <CButton onClick={() => setVisible(!visible)}>
        Launch static backdrop modal
      </CButton>
      <CModal
        visible={visible}
        backdrop={true}
        keyboard={true}
        portal={true}
        onClose={() => setVisible(false)}
      >
        <CModalHeader>
          <CModalTitle>Modal title</CModalTitle>
        </CModalHeader>
        <CModalBody>
          I will not close if you click outside me. Don't even try to press
          escape key.
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Close
          </CButton>
          <CButton color="primary">Save changes</CButton>
        </CModalFooter>
      </CModal> */}
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
              {/* <td>
                <CNavLink to="/barcode" component={NavLink}>
                  <CButton
                    onClick={() => {
                      // console.log(pkg);
                      localStorage.setItem("curr_row", JSON.stringify(pkg));
                      // console.log(localStorage.getItem("curr_row"));
                    }}
                  >
                    <CIcon icon={cilPencil} />
                  </CButton>
                </CNavLink>
              </td> */}
              <td>
                <CTooltip content="Collect" placement="bottom">
                  <CButton color="light" onClick={() => handleCollect(pkg)}>
                    <CIcon icon={cilBarcode}></CIcon>
                    <CModal
                      alignment="center"
                      scrollable
                      visible={collectVisible}
                      backdrop="static"
                      keyboard={false}
                      onClose={() => setCollectVisible(false)}
                    >
                      <CModalHeader>
                        <CModalTitle>ID Card Scanner</CModalTitle>
                      </CModalHeader>
                      <CModalBody>
                        <p>Scan ID</p>
                        <CContainer>
                          {picture == "" ? (
                            <>
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
                                  color="primary"
                                  shape="rounded-pill"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    capture();
                                    setCollectVisible(true);
                                  }}
                                >
                                  Capture
                                </CButton>
                              </CRow>
                            </>
                          ) : (
                            <CCard className="p-4">
                              <center>
                                <img src={picture} height={400} width={400} />
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
                                      const res = await fetch(
                                        "http://localhost:8000/camera",
                                        {
                                          method: "POST",
                                          headers: {
                                            // Authorization: credentialResponse.credential,
                                            "Content-Type": "application/json",
                                          },
                                          body: JSON.stringify({
                                            pic: picture,
                                          }),
                                        }
                                      );
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
                          onClick={handleCollectModalSubmit}
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
                  <CButton color="light" onClick={() => handleEdit(pkg)}>
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
                    <CModalTitle>Modify Package Details</CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                    <CCard>
                      <CCardBody className="text-left">
                        <CForm className="parcel-search-container">
                          <CCol md={6}>
                            <CFormInput
                              id="arrivalDate"
                              type="date"
                              value={selectedEditRow ? selectedEditRow.arrival : ""}
                              label="Arrival Date"
                              readOnly
                            />
                          </CCol>
                          <CCol md={6}>
                            <CFormInput
                              placeholder="Student Name"
                              id="studentName"
                              label="Student Name"
                              value={selectedEditRow ? selectedEditRow.owner_name : ""}
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
                              value={selectedEditRow ? selectedEditRow.package_type : ""}
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
                              value={selectedEditRow ? selectedEditRow.package_number : ""}
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
                              onClick={handleEditModalSubmit}
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
                  </CModalFooter>
                </CModal>
              </td>
              <td>
                <CTooltip content="Delete" placement="bottom">
                  <CButton color="light" onClick={() => handleDelete(pkg)}>
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
                          onClick={handleDeleteModalSubmit}
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
