import React, { useState } from "react";
import myImage from "/home/goutham/pras/src/IITH_logo.png";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Box,
  Collapse,
  Button
} from "@mui/material";
import { Navigate } from "react-router-dom";

function Navbar(props) {
  const [open, setOpen] = useState(false);

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton>
          <img alt="IITH Logo" src={myImage} height="50" width="50" />
        </IconButton>
        <Typography
          variant="h6"
          component="div"
          align="center"
          sx={{ flexGrow: 1 }}
        >
          {props.NavBarTitle}
        </Typography>

        {/* Have to link pages so that we can navigate from one page to the other */}
        {/* <Navigate to="/"> */}
          <Button variant="h6">Home</Button>
        {/* </Navigate> */}
        {/* <Navigate to="/uncollected_packages"> */}
          <Button variant="h6">Uncollected Packages</Button>
        {/* </Navigate> */}
        {/* <Navigate to="/collection_history"> */}
          <Button variant="h6">Collection History</Button>
        {/* </Navigate> */}
        {/* User name and picture to the top-right */}
        <IconButton onClick={() => setOpen(!open)}>
          <Avatar
            alt="User Logo"
            src="https://lh3.googleusercontent.com/a/AGNmyxYqZ_BHO6q7VKpk8KMFQEoJTLWgvFhmZgD0IkqnQA=s96-c"
          />
        </IconButton>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="subtitle1" component="div">
              <div>Username: Goutham</div>
              <span>Email ID: cs20btech11042@iith.ac.in</span>
            </Typography>
          </Box>
        </Collapse>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
