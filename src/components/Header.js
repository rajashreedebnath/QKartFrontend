import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import "./Header.css";
import { useHistory, Link } from "react-router-dom";





// A functional component named 'Header'. It takes an object as its argument with two properties: 'children' (which represents the child components) and 'hasHiddenAuthButtons' (a boolean indicating whether to hide authentication buttons)
const Header = ({ children, hasHiddenAuthButtons }) => {
  


  const history = useHistory();                                   // Initializes the 'history' object using the 'useHistory' hook from React Router. It allows the component to navigate programmatically to different routes

  const logout = () => {                                          // This function 'logout' removes the authentication-related items from local storage, navigates the user to the homepage ("/"), and reloads the page
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("balance");
    history.push("/");
    window.location.reload();
  };

  const loginToRegiter = () => {                                  // function 'loginToRegiter' navigates the user to the login page ("/login")
    history.push("/login");
  };

  const logoutToRegister = () => {                               // function 'logoutToRegister' navigates the user to the registration page ("/register")
    history.push("/register");
  };


  if (hasHiddenAuthButtons) {                                   // This conditional statement checks if 'hasHiddenAuthButtons' is 'true'
    return (
      <Box className="header">
        <Link to="/">
          <Box className="header-title">
            <img src="logo_light.svg" alt="QKart-icon"></img>
          </Box>
        </Link>
        
        <Link to="/">
          <Button
            className="explore-button"
            startIcon={<ArrowBackIcon />}
            variant="text"
          >
            Back to explore
          </Button>
        </Link>
      </Box>
    );
  }

  return (
    <Box className="header">
      <Box className="header-title">
        <img src="logo_light.svg" alt="QKart-icon"></img>
      </Box>

      {children}

      <Stack direction="row" spacing={1} alignItems="center">
        {localStorage.getItem("username") ? (
          <>
            <Avatar
              src="avatar.png"
              alt={localStorage.getItem("username") || "profile"}
            />
            <p className="username-text"> {localStorage.getItem("username")}</p>

            <Button type="primary" onClick={logout}>
              {" "}
              Logout{" "}
            </Button>
          </>
        ) : (
          <>
            <Button onClick={loginToRegiter}> Login </Button>
            <Button variant="contained" onClick={logoutToRegister}>
              Register
            </Button>
          </>
        )}
      </Stack>
    </Box>
  );
};

export default Header;
