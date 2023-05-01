import { CTable, CTableDataCell, CTableHeaderCell, CTableHead, CTableRow, CTableBody, CContainer } from "@coreui/react";
import React from "react";''
import "./viewCollected.css"; // import your custom styles
import JsonFile from "../package/data.json";

function viewCollected({ }) {
  return (
    <CContainer>
      <h1>Collected Package Table</h1>
      <CTable>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Date of Pickup</th>
            <th>Type of Parcel</th>
            <th>Post Details</th>
          </tr>
        </thead>
        <CTableBody>
          {JsonFile.map((pkg, index) => (
            <tr key={pkg.id}>
              <td>{index + 1}</td>
              <td>{pkg.pickupDate}</td>
              <td>{pkg.parcelType}</td>
              <td>{pkg.postDetails}</td>
            </tr>
          ))}
        </CTableBody>
      </CTable>
    </CContainer>
  );
}

export default viewCollected;
