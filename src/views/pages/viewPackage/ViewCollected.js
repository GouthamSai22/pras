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
} from "@coreui/react";

function viewCollected({}) {
  //modals
  const [collectVisible, setCollectVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  
  // row specific
  const [deletePkg, setDeletePkg] = useState([]);
  const [selectedDelRow, setSelectedDelRow] = useState(null);

  // const [delAlertVisible, setDelAlertVisible] = useState(false);


  const handleDeleteModalSubmit = (modifiedData) => {
    console.log("sel:", selectedDelRow.id);
    setDeletePkg(selectedDelRow);
    console.log("del:", deletePkg.id);
  const [collectVisible, setCollectVisible] = useState(false);

  const [deleteVisible, setDeleteVisible] = useState(false);

  const [deletePkgId, setDeletePkgID] = useState([]);

  const [delAlertVisible, setDelAlertVisible] = useState(false);

  const [selectedDelRow, setSelectedDelRow] = useState(null);

  function handleDeleteModalSubmit(modifiedData) {
    console.log("sel:", selectedDelRow.id);
    setDeletePkgID(selectedDelRow);
    console.log("del:", deletePkgId.id);

    fetch("http://localhost:8000/add-package", {
      method: "POST",
      headers: {
        // Authorization: credentialResponse.credential,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        del_package_id: selectedDelRow.id,
        del_package_details: selectedDelRow.postDetails,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        // if (data["result"] === "success") {
        //   <CAlert color="primary">Data added succesfully!</CAlert>;
        // } else {
        //   <CAlert color="primary">Error adding data!</CAlert>;
        // }
        console.log("sumsex");
      })
      .catch((err) => {
        console.log(err);
      });

    console.log("sel:", selectedDelRow.id);

    setDeleteVisible(false);
    console.log("modal submit");

    // setDeletePkg((prevData) =>
    // setDeletePkgID((prevData) =>
    //   prevData.map((row) => {
    //     row.id === selectedDelRow.id ? { ...row, ...modifiedData } : row;
    //   })
    // );
  };
  }

  const handleRemove = (e) => {
    console.log("DELETE ME");
    // console.log(e.target.value);
    console.log(e);
    setSelectedDelRow(e);

    setDeleteVisible(!deleteVisible);

    // if(parentButton)
    // {
    //   console.log(e);
    //   console.log(parentButton);
    //   setDeletePkg(e);
    //   setDeletePkgID(e);
    // }
    // else
    // {
    //   console.log("Modal button, pfft");
    // }
  };

  const packages = [
    {
      id: 1,
      pickupDate: "2022-05-01",
      parcelType: "Box",
      postDetails: "Sent by John",
    },
    {
      id: 2,
      pickupDate: "2022-05-02",
      parcelType: "Envelope",
      postDetails: "Sent by Mary",
    },
    {
      id: 3,
      pickupDate: "2022-05-03",
      parcelType: "Package",
      postDetails: "Sent by Bob",
    },
  ];

  return (
    <div className="package-table">
      <h1>Uncollected Package Table</h1>
      <table>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Date of Pickup</th>
            <th>Type of Parcel</th>
            <th>Post Details</th>
            <th></th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {packages.map((pkg, index) => (
            <tr key={pkg.id}>
              <td>{index + 1}</td>
              <td>{pkg.pickupDate}</td>
              <td>{pkg.parcelType}</td>
              <td>{pkg.postDetails}</td>
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
                  <CButton color="light">
                    <CIcon icon={cilPencil}></CIcon>
                  </CButton>
                </CTooltip>
              </td>
              <td>
                <CTooltip content="Delete" placement="bottom">
                  <CButton
                    className="rowDeleteButton"
                    color="light"
                    // value={pkg}
                    // onClick={handleRemove}
                    // onClick={() => setDeleteVisible(!deleteVisible)}
                    onClick={() => handleRemove(pkg)}
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
                          // onClick={() => setDeleteVisible(false)}
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

export default viewCollected;
