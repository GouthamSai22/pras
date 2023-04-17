import "./App.css";
import { Navigate, BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";

function handleLoginClick() {
  console.log("Redirecting to Login Page!");
  return <Navigate to="/login-page"></Navigate>;
}

function handleSignupClick() {
  console.log("Redirecting to Signup Page!");
  return <Navigate to="/signup-page"></Navigate>;
}

function App() {
  // function handleLoginClick() {
  //   console.log("Handling Login");
  //   return (
  //     <GoogleLogin
  //       onSuccess={(credentialResponse) => {
  //         console.log(credentialResponse);
  //       }}
  //       onError={() => {
  //         console.log("Login Failed");
  //       }}
  //       useOneTap
  //     />
  //   );
  // }
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" render={() => <App />} />
          <Route path="/login-page" render={() => <Login />} />
          <Route path="/signup-page" render={() => <Signup />} />
        </Routes>
      </BrowserRouter>
      <div className="App">
        <header className="PRAS">Postal Room Automation Service.</header>
      </div>
      <body>
        <div>
          {/* <button onClick={handleLoginClick}>Login</button>
          <button onClick={handleSignupClick}>Signup</button> */}
          <Login />
        </div>
      </body>
    </>
  );
}

export default App;
