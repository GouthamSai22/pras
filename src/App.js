import "./App.css";
import Login from "./Login";
import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  return (
    <GoogleOAuthProvider clientId="49373822151-e0j7lgasg6ilsvl5e76p50fgibesi8ui.apps.googleusercontent.com">
      <div className="App">
        <header className="PRAS">Postal Room Automation Service.</header>
        <body>
          <Login />
        </body>
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
