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
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [delAlertVisible, setDelAlertVisible] = useState(false);

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
      <h1>Collected Package Table</h1>
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
                  <CButton color="light">
                    <CIcon icon={cilBarcode}></CIcon>
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

                        <CButton color="primary" onClick={() => setDeleteVisible(false)}>Delete</CButton>


                        {/* <CAlert
                          color="primary"
                          dismissible
                          visible={delAlertVisible}
                          onClose={() => setDelAlertVisible(false)}
                        >
                          Package Deleted!
                        </CAlert>
                        <CButton color="primary" onClick={() => setDelAlertVisible(true)}>Delete</CButton> */}
                      
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
