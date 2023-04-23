// import "./App.css";
// import { Navigate } from "react-router-dom";

// function handleLoginClick() {
//   console.log("Redirecting to Login Page!");
//   return <Navigate to="/login-page"></Navigate>;
// }

// function handleSignupClick() {
//   console.log("Redirecting to Signup Page!");
//   return <Navigate to="/signup-page"></Navigate>;
// }

// function App() {
//   return (
//     <>
//       <div className="App">
//         <header className="PRAS">Postal Room Automation Service.</header>
//       </div>
//       <body>
//         <div>
//           <button onClick={handleLoginClick}>Login</button>
//           <button onClick={handleSignupClick}>Signup</button>
//         </div>
//       </body>
//     </>
//   );
// }

// export default App;

import { Box, Button, Container, Grid } from "@mui/material";
import { Navigate } from "react-router-dom";
import NavBar from "./NavBar";

function handleLoginClick() {
  console.log("Redirecting to Login Page!");
  return <Navigate to="/login-page" />;
}

function handleSignupClick() {
  console.log("Redirecting to Signup Page!");
  return <Navigate to="/signup-page" />;
}

export default function App() {
  return (
    <>
      <NavBar NavBarTitle="Log in to Continue to PRAS"/>
      <Box mt={10}>
        <Container maxWidth="md">
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <Button variant="contained" color="primary" onClick={handleLoginClick}>
                Login
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="secondary" onClick={handleSignupClick}>
                Signup
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}