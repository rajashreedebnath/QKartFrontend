import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Login.css";









const Login = () => {
  const { enqueueSnackbar } = useSnackbar();                                                  // Uses the 'useSnackbar' hook to access the 'enqueueSnackbar' function, which is used to show snack bar notifications

  const [formData, setFormData] = useState({                                                  // initializes the state variables 'formData' and 'setFormData' using the 'useState' hook. The initial state of 'formData' contains empty values for 'username' and 'password'
    username: '',
    password: ''
  })

  const [loading, setLoading] = useState(false);
  const history = useHistory();                                                              // It allows the component to navigate programmatically to different routes












                                                      // TODO: CRIO_TASK_MODULE_LOGIN - Fetch the API response
                                                      /**
                                                      * Perform the Login API call
                                                      * @param {{ username: string, password: string }} formData
                                                      *  Object with values of username, password and confirm password user entered to register
                                                      *
                                                      * API endpoint - "POST /auth/login"
                                                      *
                                                      * Example for successful response from backend:
                                                      * HTTP 201
                                                      * {
                                                      *      "success": true,
                                                      *      "token": "testtoken",
                                                      *      "username": "criodo",
                                                      *      "balance": 5000
                                                      * }
                                                      *
                                                      * Example for failed response from backend:
                                                      * HTTP 400
                                                      * {
                                                      *      "success": false,
                                                      *      "message": "Password is incorrect"
                                                      * }
                                                      *
                                                      */
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  // This asynchronous function takes the 'formData' as an argument. This function handles the login process
  const login = async (formData) => {

    // This conditional statement checks if the input data is valid. If the validation fails, it returns early from the 'login' function
    if(!validateInput(formData))
    {
      return;
    }
    //console.log(formData)
    
    try {
      setLoading(true);                                               // Indicating that the login process is in progress and a loading indicator might be displayed to the user
      
      const apiUrl = `${config.endpoint}/auth/login`;

      // Sends a POST request to the specified API endpoint URL (apiUrl) using the Axios library. The request includes the 'username' and 'password' obtained from the 'formData' object as the request body
      const res = await axios.post(apiUrl, {
        username: formData.username,
        password: formData.password,
      })


      // if the HTTP status code of the response is '201' (indicating success). If true, it displays a success message using the 'enqueueSnackbar' function provided by the 'useSnackbar' hook
      if(res.status === 201){
        enqueueSnackbar("Logged in successfully", { variant: "success" })
      }

      // This function stores the login information in local storage for future use
      persistLogin(res.data.token, res.data.username, res.data.balance)
      
      // indicating that the login process has completed
      setLoading(false)

      // navigate the user to the homepage ("/") after a successful login
      history.push("/");
      
    }
    
    // catch block to handle any 'errors' that might occur during the execution of the code within the try block
    catch(error) {
      if (error.response && error.response.status === 400) {
        enqueueSnackbar(error.response.data.message, { variant: "error" });
      }
      
    }

    // Initiates a finally block. It is often used for cleanup tasks
    finally {
      setLoading(false);
    }
  };





















                                                        // TODO: CRIO_TASK_MODULE_LOGIN - Validate the input
                                                        /**
                                                        * Validate the input values so that any bad or illegal values are not passed to the backend.
                                                        *
                                                        * @param {{ username: string, password: string }} data
                                                        *  Object with values of username, password and confirm password user entered to register
                                                        *
                                                        * @returns {boolean}
                                                        *    Whether validation has passed or not
                                                        *
                                                        * Return false and show warning message if any validation condition fails, otherwise return true.
                                                        * (NOTE: The error messages to be shown for each of these cases, are given with them)
                                                        * -    Check that username field is not an empty value - "Username is a required field"
                                                        * -    Check that password field is not an empty value - "Password is a required field"
                                                        */













  // This function is responsible for validating the input data, particularly the 'username' and 'password' fields
  const validateInput = (data) => {

    // checks if the 'username' field in the 'data' object is falsy
    if(!data.username) {
      enqueueSnackbar("Username is a required field", {variant: "warning"})
      return false
    }


    else if (!data.password) {
      enqueueSnackbar("Password is a required field", {variant: "warning"})
      return false
    }
    return true
  };











  

                                                        // TODO: CRIO_TASK_MODULE_LOGIN - Persist user's login information
                                                        /**
                                                        * Store the login information so that it can be used to identify the user in subsequent API calls
                                                        *
                                                        * @param {string} token
                                                        *    API token used for authentication of requests after logging in
                                                        * @param {string} username
                                                        *    Username of the logged in user
                                                        * @param {string} balance
                                                        *    Wallet balance amount of the logged in user
                                                        *
                                                        * Make use of localStorage: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
                                                        * -    `token` field in localStorage can be used to store the Oauth token
                                                        * -    `username` field in localStorage can be used to store the username that the user is logged in as
                                                        * -    `balance` field in localStorage can be used to store the balance amount in the user's wallet
                                                        */
  
  
  
  
  
  




  // This function is storing the login information in the browser's local storage
  const persistLogin = (token, username, balance) => {
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    localStorage.setItem("balance", balance);
  };
















  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >

      {/* renders the 'Header' component with the prop 'hasHiddenAuthButtons'. This component typically contains navigation and authentication-related elements */}
      <Header hasHiddenAuthButtons />
      
      {/* This box will contain the main content of the login page */}
      <Box className="content">
        <Stack spacing={2} className="form">
        <h2 className="title">Login</h2>


          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Enter username"
            fullWidth

            value={formData.username}
            onChange={(e) =>
              setFormData({

                // spread operator (`...formData`) is used to retain the existing properties of the `formData` object while updating the `username` property with the new value
                ...formData,
                username: e.target.value
              })
            }
          />



          <TextField
            id="password"
            variant="outlined"
            title="Password"
            label="Password"
            name="password"
            type="password"
            fullWidth
            placeholder="Enter password"

            value={formData.password}
            onChange={(e) =>
              setFormData({
                ...formData,
                password: e.target.value
              })
            }
          />


          {/* It checks the value of the loading variable. If loading is truthy, the expression before the : is evaluated; otherwise, the expression after the : is evaluated */}
          {loading ? (

            <Box display="flex" justifyContent="center">
              <CircularProgress />
            </Box>

            ) : (

            <Button
              className="button"
              variant="contained"
              onClick={() => login(formData)}
            >
              LOGIN TO QKART
            </Button>
            
          )}


          <p className="secondary-action">
            Don't have an account?{" "}
            <Link to="/register" className="link">
              Register now
            </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Login;
