import { CreditCard, Delete } from "@mui/icons-material";
import {
  Button,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { config } from "../App";
import Cart, { getTotalCartValue, generateCartItemsFrom } from "./Cart";
import "./Checkout.css";
import Footer from "./Footer";
import Header from "./Header";

                                                // Definition of Data Structures used
                                                /**
                                                * @typedef {Object} Product - Data on product available to buy
                                                *
                                                * @property {string} name - The name or title of the product
                                                * @property {string} category - The category that the product belongs to
                                                * @property {number} cost - The price to buy the product
                                                * @property {number} rating - The aggregate rating of the product (integer out of five)
                                                * @property {string} image - Contains URL for the product image
                                                * @property {string} _id - Unique ID for the product
                                                */

                                                /**
                                                * @typedef {Object} CartItem -  - Data on product added to cart
                                                *
                                                * @property {string} name - The name or title of the product in cart
                                                * @property {string} qty - The quantity of product added to cart
                                                * @property {string} category - The category that the product belongs to
                                                * @property {number} cost - The price to buy the product
                                                * @property {number} rating - The aggregate rating of the product (integer out of five)
                                                * @property {string} image - Contains URL for the product image
                                                * @property {string} productId - Unique ID for the product
                                                */

                                                /**
                                                * @typedef {Object} Address - Data on added address
                                                *
                                                * @property {string} _id - Unique ID for the address
                                                * @property {string} address - Full address string
                                                */

                                                /**
                                                * @typedef {Object} Addresses - Data on all added addresses
                                                *
                                                * @property {Array.<Address>} all - Data on all added addresses
                                                * @property {string} selected - Id of the currently selected address
                                                */

                                                /**
                                                * @typedef {Object} NewAddress - Data on the new address being typed
                                                *
                                                * @property { Boolean } isAddingNewAddress - If a new address is being added
                                                * @property { String} value - Latest value of the address being typed
                                                */

                // TODO: CRIO_TASK_MODULE_CHECKOUT - Should allow to type a new address in the text field and add the new address or cancel adding new address
                                                /**
                                                * Returns the complete data on all products in cartData by searching in productsData
                                                *
                                                * @param { String } token
                                                *    Login token
                                                *
                                                * @param { NewAddress } newAddress
                                                *    Data on new address being added
                                                *
                                                * @param { Function } handleNewAddress
                                                *    Handler function to set the new address field to the latest typed value
                                                *
                                                * @param { Function } addAddress
                                                *    Handler function to make an API call to add the new address
                                                *
                                                * @returns { JSX.Element }
                                                *    JSX for the Add new address view
                                                *
                                                */







const AddNewAddressView = ({
  token,
  newAddress,
  handleNewAddress,
  addAddress,
}) => {
  return (
    <Box display="flex" flexDirection="column">

      {/* This renders a 'TextField' component, allowing users to input their address */}
      <TextField
        multiline
        minRows={4}
        placeholder="Enter your complete address"


        // The 'value' prop is set to 'newAddress.value', binding the value of the input field to the 'value' property of the 'newAddress' object
        value={newAddress.value}

        // The 'onChange' prop specifies a callback function that updates the 'newAddress' object when the input value changes
        onChange={(e) => {
          handleNewAddress({
            ...newAddress,
            value: e.target.value,
          });
        }}

      />



      <Stack direction="row" my="1rem">

        <Button
          variant="contained"


          // The 'onClick' prop specifies an asynchronous arrow function that calls the 'addAddress' function with 'token' and 'newAddress' as arguments when the button is clicked
          onClick={async () => {
            await addAddress(token, newAddress);
          }}


        >
          Add
        </Button>
        


        <Button
          variant="text"


          // The 'onClick' prop specifies an arrow function that updates the 'newAddress' object by setting 'isAddingNewAddress' to 'false' when the button is clicked
          onClick={(e) => {
            handleNewAddress({
              ...newAddress,
              isAddingNewAddress: false,
            });
          }}
        >
          Cancel
        </Button>
      </Stack>
    </Box>
  );
};












const Checkout = () => {
  const token = localStorage.getItem("token");
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [addresses, setAddresses] = useState({ all: [], selected: "" });
  const [newAddress, setNewAddress] = useState({
    isAddingNewAddress: false,
    value: "",
  });














  // Fetch the entire products list
  const getProducts = async () => {
    try {
      const response = await axios.get(`${config.endpoint}/products`);

      setProducts(response.data);
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 500) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
        return null;
      } else {
        enqueueSnackbar(
          "Could not fetch products. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
    }
  };












  // Fetch cart data
  const fetchCart = async (token) => {
    if (!token) return;
    try {
      const response = await axios.get(`${config.endpoint}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch {
      enqueueSnackbar(
        "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
        {
          variant: "error",
        }
      );
      return null;
    }
  };





                                                      /**
                                                       * Fetch list of addresses for a user
                                                       *
                                                       * API Endpoint - "GET /user/addresses"
                                                       *
                                                       * Example for successful response from backend:
                                                       * HTTP 200
                                                       * [
                                                       *      {
                                                       *          "_id": "",
                                                       *          "address": "Test address\n12th street, Mumbai"
                                                       *      },
                                                       *      {
                                                       *          "_id": "BW0jAAeDJmlZCF8i",
                                                       *          "address": "New address \nKolam lane, Chennai"
                                                       *      }
                                                       * ]
                                                       *
                                                       * Example for failed response from backend:
                                                       * HTTP 401
                                                       * {
                                                       *      "success": false,
                                                       *      "message": "Protected route, Oauth2 Bearer token not found"
                                                       * }
                                                       */
  
  
  
  










const getAddresses = async (token) => {
    if (!token) return;

    try {
      const response = await axios.get(`${config.endpoint}/user/addresses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAddresses({ ...addresses, all: response.data });
      return response.data;
    } catch {
      enqueueSnackbar(
        "Could not fetch addresses. Check that the backend is running, reachable and returns valid JSON.",
        {
          variant: "error",
        }
      );
      return null;
    }
  };














                                              /**
                                               * Handler function to add a new address and display the latest list of addresses
                                               *
                                               * @param { String } token
                                               *    Login token
                                               *
                                               * @param { NewAddress } newAddress
                                               *    Data on new address being added
                                               *
                                               * @returns { Array.<Address> }
                                               *    Latest list of addresses
                                               *
                                               * API Endpoint - "POST /user/addresses"
                                               *
                                               * Example for successful response from backend:
                                               * HTTP 200
                                               * [
                                               *      {
                                               *          "_id": "",
                                               *          "address": "Test address\n12th street, Mumbai"
                                               *      },
                                               *      {
                                               *          "_id": "BW0jAAeDJmlZCF8i",
                                               *          "address": "New address \nKolam lane, Chennai"
                                               *      }
                                               * ]
                                               *
                                               * Example for failed response from backend:
                                               * HTTP 401
                                               * {
                                               *      "success": false,
                                               *      "message": "Protected route, Oauth2 Bearer token not found"
                                               * }
                                               */












  const addAddress = async (token, newAddress) => {
    try {
      // TODO: CRIO_TASK_MODULE_CHECKOUT - Add new address to the backend and display the latest list of addresses





      // Sends a POST request to the specified endpoint to add a new address
      const res = await axios.post(
        `${config.endpoint}/user/addresses`,
        {
          // The address data is sent in the request body as an object with a key 'address' containing the value of the new address
          address: newAddress.value,
        },
        {
          // The request also includes an Authorization header with the user's token for authentication
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // If the POST request is successful,
      // this line updates the 'addresses' state variable with the new list of addresses retrieved from the response ('res.data').
      // It spreads the existing 'addresses' state and updates the 'all' property with the new list of addresses
      setAddresses({
        ...addresses,
        all: res.data,
      });
      setNewAddress({
        value: "",
        isAddingNewAddress: false,
      });








    } catch (e) {
      if (e.response) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not add this address. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
    }
  };


















                                                      /**
                                                       * Handler function to delete an address from the backend and display the latest list of addresses
                                                       *
                                                       * @param { String } token
                                                       *    Login token
                                                       *
                                                       * @param { String } addressId
                                                       *    Id value of the address to be deleted
                                                       *
                                                       * @returns { Array.<Address> }
                                                       *    Latest list of addresses
                                                       *
                                                       * API Endpoint - "DELETE /user/addresses/:addressId"
                                                       *
                                                       * Example for successful response from backend:
                                                       * HTTP 200
                                                       * [
                                                       *      {
                                                       *          "_id": "",
                                                       *          "address": "Test address\n12th street, Mumbai"
                                                       *      },
                                                       *      {
                                                       *          "_id": "BW0jAAeDJmlZCF8i",
                                                       *          "address": "New address \nKolam lane, Chennai"
                                                       *      }
                                                       * ]
                                                       *
                                                       * Example for failed response from backend:
                                                       * HTTP 401
                                                       * {
                                                       *      "success": false,
                                                       *      "message": "Protected route, Oauth2 Bearer token not found"
                                                       * }
                                                       */












  const deleteAddress = async (token, addressId) => {
    try {
      // TODO: CRIO_TASK_MODULE_CHECKOUT - Delete selected address from the backend and display the latest list of addresses




      // Sends a DELETE request to the specified endpoint
      const res = await axios.delete(
        `${config.endpoint}/user/addresses/${addressId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // If the DELETE request is successful, this line updates the state variable 'addresses'
      // It spreads the existing properties of the 'addresses' object and updates the 'all' property with the response data ('res.data')
      setAddresses({
        ...addresses,
        all: res.data,
      });







    } catch (e) {
      if (e.response) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not delete this address. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
    }
  };










                // TODO: CRIO_TASK_MODULE_CHECKOUT - Validate request for checkout
                                                  /**
                                                  * Return if the request validation passed. If it fails, display appropriate warning message.
                                                  *
                                                  * Validation checks - show warning message with given text if any of these validation fails
                                                  *
                                                  *  1. Not enough balance available to checkout cart items
                                                  *    "You do not have enough balance in your wallet for this purchase"
                                                  *
                                                  *  2. No addresses added for user
                                                  *    "Please add a new address before proceeding."
                                                  *
                                                  *  3. No address selected for checkout
                                                  *    "Please select one shipping address to proceed."
                                                  *
                                                  * @param { Array.<CartItem> } items
                                                  *    Array of objects with complete data on products added to the cart
                                                  *
                                                  * @param { Addresses } addresses
                                                  *    Contains data on array of addresses and selected address id
                                                  *
                                                  * @returns { Boolean }
                                                  *    Whether validation passed or not
                                                  *
                                                  */










  // This function is responsible for validating the request before proceeding with the checkout process
  const validateRequest = (items, addresses) => {




    //It uses the localStorage.getItem method to retrieve the balance value stored under the key "balance". 
    if (localStorage.getItem("balance") < getTotalCartValue(items)) {
      enqueueSnackbar(
        "You do not have enough balance in your wallet for this purchase",
        { variant: "warning" }
      );
      return false;                               // After displaying the warning message, this line returns 'false', indicating that the validation has failed
    }
    //  This line checks if there are no addresses stored in the 'addresses.all' array
    else if (!addresses.all.length) {
      enqueueSnackbar("Please add a new address before proceeding.", {
        variant: "warning",
      });
      return false;
    }
    // This line checks if no shipping address is selected from the available addresses
    else if (!addresses.selected.length) {
      enqueueSnackbar("Please select one shipping address to proceed.", {
        variant: "warning",
      });
      return false;
    }
    // If all validation checks pass, this line returns 'true',
    // indicating that the validation was successful and it's safe to proceed with the checkout process
    else {
      return true;
    }




  };















                      // TODO: CRIO_TASK_MODULE_CHECKOUT
                                                      /**
                                                      * Handler function to perform checkout operation for items added to the cart for the selected address
                                                      *
                                                      * @param { String } token
                                                      *    Login token
                                                      *
                                                      * @param { Array.<CartItem } items
                                                      *    Array of objects with complete data on products added to the cart
                                                      *
                                                      * @param { Addresses } addresses
                                                      *    Contains data on array of addresses and selected address id
                                                      *
                                                      * @returns { Boolean }
                                                      *    If checkout operation was successful
                                                      *
                                                      * API endpoint - "POST /cart/checkout"
                                                      *
                                                      * Example for successful response from backend:
                                                      * HTTP 200
                                                      * {
                                                      *  "success": true
                                                      * }
                                                      *
                                                      * Example for failed response from backend:
                                                      * HTTP 400
                                                      * {
                                                      *  "success": false,
                                                      *  "message": "Wallet balance not sufficient to place order"
                                                      * }
                                                      *
                                                      */















  // This function is responsible for initiating the checkout process
  const performCheckout = async (token, items, addresses) => {



    // This line checks the result of the 'validateRequest' function
    // If the validation succeeds (returns 'true'), the code inside the 'if' block will execute; otherwise, it will be skipped
    if (validateRequest(items, addresses)) {
      try {

        // Sends a POST request to the specified endpoint to initiate the checkout process
        await axios.post(
          `${config.endpoint}/cart/checkout`,
          {
            addressId: addresses.selected,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // If the checkout process is successful, this line displays a success message
        enqueueSnackbar("Order placed successfully", { variant: "success" });
        
        // This line calculates the updated balance after deducting the total cart value from the current balance stored in the local storage
        const updatedBalance =
          // retrieves the current balance and converts it to an integer using 'parseInt'
          parseInt(localStorage.getItem("balance")) - getTotalCartValue(items);
        // updates the balance stored in the local storage with the newly calculated 'updatedBalance'
        localStorage.setItem("balance", updatedBalance);
        // After successfully placing the order and updating the balance, this line redirects the user to the "/thanks" page
        history.push("/thanks");
      } catch (e) {
        // Checks if the error has a response object. If it does, it means that the error is coming from the server
        if (e.response) {
          enqueueSnackbar(e.response.data.message, { variant: "error" });
        } else {
          enqueueSnackbar("Something Went Wrong", { variant: "error" });
        }
      }
    }




  };

















  // TODO: CRIO_TASK_MODULE_CHECKOUT - Fetch addressses if logged in, otherwise show info message and redirect to Products page







  
  // Fetch products and cart data on page load
  useEffect(() => {
    const onLoadHandler = async () => {



      //This line checks if the 'token' variable is falsy. If there is no token (meaning the user is not logged in), the code inside this block will execute
      if (!token) {
        enqueueSnackbar("You must be logged in to access checkout page", {
          history: "warning",
        });
        history.push("/");            // This line redirects the user to the home page
        return;
      }
      await getAddresses(token);





      const productsData = await getProducts();

      const cartData = await fetchCart(token);

      if (productsData && cartData) {
        const cartDetails = await generateCartItemsFrom(cartData, productsData);
        setItems(cartDetails);
      }
    };
    onLoadHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  
  
  
  
  
  return (
    <>
      <Header />
      <Grid container>
        <Grid item xs={12} md={9}>
          <Box className="shipping-container" minHeight="100vh">
            <Typography color="#3C3C3C" variant="h4" my="1rem">
              Shipping
            </Typography>
            <Typography color="#3C3C3C" my="1rem">
              Manage all the shipping addresses you want. This way you won't
              have to enter the shipping address manually with every order.
              Select the address you want to get your order delivered.
            </Typography>
            <Divider />
            <Box>
              {/* TODO: CRIO_TASK_MODULE_CHECKOUT - Display list of addresses and corresponding "Delete" buttons, if present, of which 1 can be selected */}









              {/* If there are addresses available, it renders the code inside the 'first set' of parentheses, otherwise 'second set' */}
              {addresses.all.length ? (

                // First set
                // This maps through all addresses in the 'addresses.all' array and generates JSX for each address
                addresses.all.map((ele) => {
                  return (
                    // This creates a box with a dynamic class name based on whether the address is selected or not
                    <Box
                      className={
                        ele._id === addresses.selected
                          ? "address-item selected"
                          : "address-item not-selected"
                      }
                      key={ele._id}
                      onClick={() => {
                        setAddresses({
                          ...addresses,
                          selected: ele._id,
                        });
                      }}
                    >

                      {/* This renders the address text. */}
                      <Typography>{ele.address}</Typography>
                      {/* Renders a button with a delete icon and handles the delete action asynchronously when clicked */}
                      <Button
                        startIcon={<Delete />}
                        onClick={async () => {
                          await deleteAddress(token, ele._id);
                        }}
                      >
                        Delete
                      </Button>
                    </Box>
                  );
                })
              ) : (



                // Second set
                // This renders a message indicating that no addresses were found
                <Typography my="1rem">
                 No addresses found for this account. Please add one to proceed
                </Typography>










              )}

            </Box>

            {/* TODO: CRIO_TASK_MODULE_CHECKOUT - Dislay either "Add new address" button or the <AddNewAddressView> component to edit the currently selected address */}
            



            
            {/* It checks if the 'isAddingNewAddress' property of the 'newAddress' object is false
            If it's false, it renders the code inside the 'first set', otherwise 'second set' */}
            {!newAddress.isAddingNewAddress ? (




              // first set
              <Button
                color="primary"
                variant="contained"
                id="add-new-btn"
                size="large"
                onClick={() => {
                  setNewAddress((currNewAddress) => ({
                    ...currNewAddress,
                    isAddingNewAddress: true,             //  indicating that a new address is being added
                  }));
                }}
                >
                Add new address
              </Button>






            ) : (



              // second set
              // This component presumably handles the addition of a new address
              <AddNewAddressView
                token={token}
                newAddress={newAddress}
                handleNewAddress={setNewAddress}
                addAddress={addAddress}
              />




            )}




            <Typography color="#3C3C3C" variant="h4" my="1rem">
              Payment
            </Typography>
            <Typography color="#3C3C3C" my="1rem">
              Payment Method
            </Typography>
            <Divider />

            <Box my="1rem">
              <Typography>Wallet</Typography>
              <Typography>
                Pay ${getTotalCartValue(items)} of available $
                {localStorage.getItem("balance")}
              </Typography>
            </Box>

            <Button
              startIcon={<CreditCard />}
              variant="contained"



              onClick={async () => {
                await performCheckout(token, items, addresses);
              }}


            >
              PLACE ORDER
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12} md={3} bgcolor="#E9F5E1">
          <Cart isReadOnly products={products} items={items} />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
};

export default Checkout;
