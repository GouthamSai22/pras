import "./index.css";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

const responseSuccessGoogle = (response) => {
  console.log("Successful login");
  console.log(response);
};

const responseFailedGoogle = (response) => {
  console.log("Failed Login");
  console.log(response);
};

function Login() {
  return (
    <GoogleOAuthProvider clientId="49373822151-e0j7lgasg6ilsvl5e76p50fgibesi8ui.apps.googleusercontent.com">
      <div>
        <p>Log in to continue to PRAS.</p>

        <GoogleLogin
          onSuccess={(credentialResponse) => {
            console.log(credentialResponse);
          }}
          onError={() => {
            console.log("Login Failed");
          }}
          useOneTap
        />
      </div>
    </GoogleOAuthProvider>
  );
}

export default Login;
