import "./index.css";
import jwt_decode from "jwt-decode";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

function Signup() {
  return (
    <>
      <div>
        <p>Welcome Friends!</p>

        <p>Sign up to start using the PRAS.</p>
      </div>
      <GoogleOAuthProvider clientId="49373822151-e0j7lgasg6ilsvl5e76p50fgibesi8ui.apps.googleusercontent.com">
        <div>
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              console.log(credentialResponse);
              //credentialResponse has profile object and stuff

              localStorage.setItem("credential", credentialResponse.credential);

              fetch("http://localhost:8000/auth", {
                headers: {
                  Authorization: credentialResponse.credential,
                },
              })
                .then((res) => res.json())
                .then((data) => {
                  console.log(data);
                  console.log("Data Logged!");
                  const decoded_token = jwt_decode(credentialResponse.credential);
                  localStorage.setItem("user_name", decoded_token["name"]);
                  localStorage.setItem("user_email", decoded_token["email"]);
                  localStorage.setItem("user_pic_url", decoded_token["picture"]);
                  // Have to figure out how to redirect the page to the home page after this.
                })
                .catch((err) => {
                  console.log(err);
                });
            }}
            onError={() => {
              console.log("Login Failed");
            }}
            useOneTap
            shape="pill"
          />
        </div>
      </GoogleOAuthProvider>
    </>
  );
}

export default Signup;
