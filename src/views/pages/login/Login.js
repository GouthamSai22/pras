import React from "react";
import { useState } from "react";
import { NavLink, Navigate } from "react-router-dom";
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CNavLink,
  CRow,
} from "@coreui/react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import jwt_decode from "jwt-decode";

const Login = () => {
  const [loginSuccess, setSuccess] = useState(false);

  return (
    <>
      {loginSuccess ? (
        <Navigate to="/view-packages/all" replace />
      ) : (
        <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
          <CContainer>
            <CRow className="justify-content-center">
              <CCol md={8}>
                <CCardGroup>
                  <CCard className="p-4">
                    <CCardBody>
                      <CForm>
                        <h1>Login</h1>
                        <p className="text-medium-emphasis">
                          Sign In to your account
                        </p>
                        <CRow>
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

                                    fetch("http://localhost:8000/auth", {
                                      headers: {
                                        Authorization:
                                          credentialResponse.credential,
                                      },
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
                        </CRow>
                      </CForm>
                    </CCardBody>
                  </CCard>
                  <CCard
                    className="text-white bg-primary py-5"
                    style={{ width: "44%" }}
                  >
                    <CCardBody className="text-center">
                      <div>
                        <h2>Sign up</h2>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipisicing
                          elit, sed do eiusmod tempor incididunt ut labore et
                          dolore magna aliqua.
                        </p>
                        <CNavLink to="/register" component={NavLink}>
                          <CButton
                            color="primary"
                            className="mt-3"
                            active
                            tabIndex={-1}
                          >
                            Register Now!
                          </CButton>
                        </CNavLink>
                      </div>
                    </CCardBody>
                  </CCard>
                </CCardGroup>
              </CCol>
            </CRow>
          </CContainer>
        </div>
      )}
    </>
  );
};

export default Login;
