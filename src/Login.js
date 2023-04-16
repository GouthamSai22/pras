import "./index.css";
import { GoogleLogin } from "@react-oauth/google";

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
    <div>
      <p>Log in to continue to PRAS.</p>

      <GoogleLogin
        onSuccess={responseSuccessGoogle}
        onFailure={responseFailedGoogle}
        shape="pill"
      />
    </div>
  );
}

export default Login;
