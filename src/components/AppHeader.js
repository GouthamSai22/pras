import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  CContainer,
  CHeader,
  CHeaderBrand,
  CHeaderDivider,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilBell, cilEnvelopeOpen, cilList, cilMenu } from "@coreui/icons";

import { AppBreadcrumb } from "./index";
import { AppHeaderDropdown } from "./header/index";
import { logo } from "src/assets/brand/logo";

const AppHeader = () => {
  const dispatch = useDispatch();
  const sidebarShow = useSelector((state) => state.sidebarShow);

  return (
    <CHeader position="sticky" className="mb-4">
      <CContainer fluid>
        <CHeaderToggler
          className="ps-1"
          onClick={() => dispatch({ type: "set", sidebarShow: !sidebarShow })}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderBrand className="mx-auto d-md-none" to="/">
          <CIcon icon={logo} height={48} alt="Logo" />
        </CHeaderBrand>
        <CHeaderNav className="d-none d-md-flex me-auto">
          {/* <CNavItem>
            <CNavLink to="/dashboard" component={NavLink}>
              Dashboard
            </CNavLink>
          </CNavItem> */}
          <CNavItem>
            <CNavLink to="/view-packages/uncollected" component={NavLink}>
              View Packages
            </CNavLink>
            {/* <CDropdown variant="nav-item">
              <CDropdownToggle placement="bottom-end">
                View Packages
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem>
                  <CNavLink to="/view-packages/collected" component={NavLink}>
                    View Collected Packages
                  </CNavLink>
                </CDropdownItem>
                <CDropdownItem>
                  <CNavLink to="/view-packages/uncollected" component={NavLink}>
                    View UnCollected Packages
                  </CNavLink>
                </CDropdownItem>
              </CDropdownMenu>
            </CDropdown> */}
          </CNavItem>
          <CNavItem>
            {/* <CDropdown variant="nav-item">
              <CDropdownToggle placement="bottom-end">Package</CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem>
                  <CNavLink to="/package/add-package" component={NavLink}>
                    Add Package
                  </CNavLink>
                </CDropdownItem>
                <CDropdownItem>
                  <CNavLink to="/package/delete-package" component={NavLink}>
                    Delete Package
                  </CNavLink>
                </CDropdownItem>
                <CDropdownItem>
                  <CNavLink to="/package/modify-package" component={NavLink}>
                    Modify Package
                  </CNavLink>
                </CDropdownItem>
                <CDropdownItem>
                  <CNavLink to="/package/search-package" component={NavLink}>
                    Search Package
                  </CNavLink>
                </CDropdownItem>
              </CDropdownMenu>
            </CDropdown> */}
            <CNavLink to="/camera" component={NavLink}>
              Add Package
            </CNavLink>
          </CNavItem>

          {/* <CNavItem>
            <CNavLink to="/camera" component={NavLink}>
              Camera
            </CNavLink>
          </CNavItem> */}
          {/* <CNavItem>
            <CNavLink to="/barcode" component={NavLink}>
              Collect Package
            </CNavLink>
          </CNavItem> */}
          <CNavItem>
            <CNavLink href="#">Statistics</CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">View Users</CNavLink>
          </CNavItem>
        </CHeaderNav>
        <CHeaderNav>
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilBell} size="lg" />
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilList} size="lg" />
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilEnvelopeOpen} size="lg" />
            </CNavLink>
          </CNavItem>
        </CHeaderNav>
        <CHeaderNav className="ms-3">
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
      <CHeaderDivider />
      <CContainer fluid>
        <AppBreadcrumb />
      </CContainer>
    </CHeader>
  );
};

export default AppHeader;
