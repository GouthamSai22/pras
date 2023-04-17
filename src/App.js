import "./App.css";
import Login from "./Login";
import Signup from "./Signup";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

// import { useGoogleLogin } from "@react-oauth/google";

function App() {
  function handleLoginClick() {
    console.log("Handling Login");
    return (
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          console.log(credentialResponse);
        }}
        onError={() => {
          console.log("Login Failed");
        }}
        useOneTap
      />
    );
  }
  return (
    <div className="App">
      <header className="PRAS">Postal Room Automation Service.</header>
      
        {/* <button onClick={handleLoginClick}>Login</button> */}
        <Login />
      
    </div>
  );
}

export default App;
