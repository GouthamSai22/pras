import { CTable, CTableDataCell, CTableHeaderCell, CTableHead, CTableRow, CTableBody } from "@coreui/react";
import React from "react";
import JsonFile from "./data.json";

function JsonDataDisplay(props) {
  const DisplayData = props.jsonFile.map((info) => {
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
  return <JsonDataDisplay jsonFile={JsonFile}/>;
};

export default modifyPackage;
