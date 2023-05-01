import React from "react";
import "./viewCollected.css"; // import your custom styles
import CIcon from "@coreui/icons-react";
import { cilBarcode, cilPencil, cilTrash } from "@coreui/icons";
import { CButton } from "@coreui/react";
import { CTooltip } from "@coreui/react";

function viewCollected({}) {
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
                <CButton color="light">
                  <CIcon icon={cilTrash}></CIcon>
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
