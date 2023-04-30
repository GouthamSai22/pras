import { CTable, CTableDataCell, CTableHeaderCell, CTableHead, CTableRow, CTableBody } from "@coreui/react";
import React from "react";
import JsonData from "./data.json";

function JsonDataDisplay() {
  const DisplayData = JsonData.map((info) => {
    return (
      <CTableRow>
        <CTableDataCell>{info.id}</CTableDataCell>
        <CTableDataCell>{info.name}</CTableDataCell>
        <CTableDataCell>{info.city}</CTableDataCell>
      </CTableRow>
    );
  });
  return (
    <CTable striped bordered>
      <CTableHead>
        <CTableHeaderCell scope="col">#</CTableHeaderCell>
        <CTableHeaderCell scope="col">Package Number</CTableHeaderCell>
        <CTableHeaderCell scope="col">Package Type</CTableHeaderCell>
        {/* <CTableHeaderCell scope="col">Name of Owner</CTableHeaderCell>
        <CTableHeaderCell scope="col">Time of Arrival</CTableHeaderCell>
        <CTableHeaderCell scope="col">Status</CTableHeaderCell> */}
      </CTableHead>
      <CTableBody>{DisplayData}</CTableBody>
    </CTable>
  );
}

const modifyPackage = () => {
  return <JsonDataDisplay />;
};

export default modifyPackage;
