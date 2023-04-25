import { CButton} from "@coreui/react";
import React from "react";
import { NavLink } from 'react-router-dom'
import {
  CContainer,
  CRow,
  CNavLink,
  CNavItem,
} from '@coreui/react'

const packageOptions = () => {
  return (
    <CContainer fluid>
      <CRow className="mx-auto">
        <CNavItem>
          <CNavLink to="/package/add-package" component={NavLink}>
            <CButton
              color="primary"
              variant="outline"
              size="lg"
              shape="rounded-pill"
            >
              Add Package
            </CButton>
          </CNavLink>
        </CNavItem>
      </CRow>
      <CRow className="mx-auto">
        <CNavItem>
          <CNavLink to="/package/delete-package" component={NavLink}>
            <CButton
              color="primary"
              variant="outline"
              size="lg"
              shape="rounded-pill"
            >
              Delete Package
            </CButton>
          </CNavLink>
        </CNavItem>
      </CRow>
      <CRow className="mx-auto">
        <CNavItem>
          <CNavLink to="/package/modify-package" component={NavLink}>
            <CButton
              color="primary"
              variant="outline"
              size="lg"
              shape="rounded-pill"
            >
              Modify Package
            </CButton>
          </CNavLink>
        </CNavItem>
      </CRow>
    </CContainer>
  );
};

export default packageOptions;
