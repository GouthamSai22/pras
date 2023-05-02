import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CNavItem,
  CRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilRoom, cilPhone } from "@coreui/icons";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

const Register = () => {
  const [mobilenumber, setMobileNumber] = useState("");
  const [roomnumber, setRoomNumber] = useState("");
  const [loginSuccess, setSuccess] = useState(false);
  return (
    <>
      {loginSuccess ? (
        <Navigate to="/view-packages/uncollected" replace />
      ) : (
        <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
          <CContainer>
            <CRow className="justify-content-center">
              <CCol md={9} lg={7} xl={6}>
                <CCard className="mx-4">
                  <CCardBody className="p-4">
                    <CForm>
                      <h1>Register</h1>
                      <p className="text-medium-emphasis">
                        Create your account
                      </p>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilPhone} />
                        </CInputGroupText>
                        <CFormInput
                          placeholder="Mobile Number"
                          type="tel"
                          onChange={(e) => setMobileNumber(e.target.value)}
                        />
                      </CInputGroup>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilRoom} />
                        </CInputGroupText>
                        <CFormInput
                          placeholder="Room Number"
                          type="text"
                          onChange={(e) => setRoomNumber(e.target.value)}
                        />
                      </CInputGroup>
                      {/* <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput placeholder="Email" autoComplete="email" />
                  </CInputGroup> */}
                      <div className="d-grid">
                        <CNavItem>
                          {/* <CButton
                        color="success"
                        to="/view-packages/uncollected"
                        component={NavLink}
                      >
                        Create Account
                      </CButton> */}
                          <GoogleOAuthProvider clientId="49373822151-e0j7lgasg6ilsvl5e76p50fgibesi8ui.apps.googleusercontent.com">
                            <div>
                              <center>
                                <GoogleLogin
                                  onSuccess={(credentialResponse) => {
                                    console.log(credentialResponse);
                                    //credentialResponse has profile object and stuff

                                    localStorage.setItem(
                                      "credential",
                                      credentialResponse.credential
                                    );

                                    fetch("http://localhost:8000/signup", {
                                      headers: {
                                        Authorization:
                                          credentialResponse.credential,
                                      },
                                      body: JSON.stringify({
                                        phone_number: mobilenumber,
                                        room: roomnumber,
                                      }),
                                    })
                                      .then((res) => res.json())
                                      .then((data) => {
                                        console.log(data);
                                        console.log("Data Logged!");
                                        localStorage.setItem(
                                          "user_name",
                                          data["name"]
                                        );
                                        localStorage.setItem(
                                          "user_email",
                                          data["email"]
                                        );
                                        localStorage.setItem(
                                          "user_pic_url",
                                          data["picture"]
                                        );
                                        localStorage.setItem(
                                          "isAdmin",
                                          data["isAdmin"]
                                        );
                                      })
                                      .catch((err) => {
                                        console.log(err);
                                      });
                                    setSuccess(true);
                                  }}
                                  onError={() => {
                                    console.log("Login Failed");
                                  }}
                                  useOneTap
                                  shape="pill"
                                />
                              </center>
                            </div>
                          </GoogleOAuthProvider>
                        </CNavItem>
                      </div>
                    </CForm>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
          </CContainer>
        </div>
      )}
    </>
  );
};

export default Register;
