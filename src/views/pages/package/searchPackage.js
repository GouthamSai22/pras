import { CButton, CCol, CForm, CFormInput, CFormSelect } from "@coreui/react";
import React from "react";

const searchPackage = () => {
  return (
    <CForm className="row g-3">
      <CCol lg={6}>
        <CFormInput
          type="text"
          id="keyword"
          placeholder="Keyword"
          label="Search for"
        />
      </CCol>
      <CCol lg={4}>
        <CFormSelect id="searchby" label="Search By">
          <option>Search By</option>
          <option>Package Number</option>
          <option>Package Type</option>
          <option>Owner Name</option>
          <option>Arrival Date</option>
        </CFormSelect>
      </CCol>
      <CCol lg={2}>
        <CButton type="submit">Search</CButton>
      </CCol>
    </CForm>
  );
};

export default searchPackage;
