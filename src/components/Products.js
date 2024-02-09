import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";
import Cart, { generateCartItemsFrom } from "./Cart";




                                  // Definition of Data Structures used
                                  /**
                                  * @typedef {Object} Product - Data on product available to buy
                                  * 
                                  * @property {string} name - The name or title of the product

                                  /**
                                  * @typedef {Object} CartItem -  - Data on product added to cart
                                  * 
                                  * @property {string} name - The name or title of the product in cart
                                  * @property {string} qty - The quantity of product added to cart
                                  * @property {string} category - The category that the product belongs to
                                  * @property {number} cost - The price to buy the product
                                  * @property {number} rating - The aggregate rating of the product (integer out of five)
                                  * @property {string} image - Contains URL for the product image
                                  * @property {string} _id - Unique ID for the product
                                  */


                                  


const Products = () => {                                          //This declares a functional component named 'Products'

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it



  const token = localStorage.getItem("token");                    // Retrieves the token stored in the local storage.
  const [products, setProducts] = useState([]);                   // Initializes a state variable 'products' and a function 'setProducts' to update it, using the 'useState' hook. The initial value of 'products' is an empty array.
  const [isLoading, setIsLoading] = useState(false);              // Initializes a state variable 'isLoading' and a function 'setIsLoading' to update it, using the 'useState' hook. The initial value of 'isLoading' is 'false'
  const {enqueueSnackbar} = useSnackbar();                        // Destructures the 'enqueueSnackbar' function from the 'useSnackbar' hook. It's used for displaying snackbars in the UI.
  const [filteredProducts, setFilteredProducts] = useState([]);   // Initializes a state variable 'filteredProducts' and a function 'setFilteredProducts' to update it, using the 'useState' hook. The initial value of 'filteredProducts' is an empty array
  const [debounceTimeout, setDebounceTimeout] = useState(null);   // Initializes a state variable 'debounceTimeout' and a function 'setDebounceTimeout' to update it, using the 'useState' hook. The initial value of 'debounceTimeout' is 'null'
  const [items, setItems] = useState([])                          // Initializes a state variable 'items' and a function 'setItems' to update it, using the 'useState' hook. The initial value of 'items' is an empty array.




                                /**
                                 * Make API call to get the products list and store it to display the products
                                 *
                                 * @returns { Array.<Product> }
                                 *      Array of objects with complete data on all available products
                                 *
                                 * API endpoint - "GET /products"
                                 *
                                 * Example for successful response from backend:
                                 * HTTP 200
                                 * [
                                 *      {
                                 *          "name": "iPhone XR",
                                 *          "category": "Phones",
                                 *          "cost": 100,
                                 *          "rating": 4,
                                 *          "image": "https://i.imgur.com/lulqWzW.jpg",
                                 *          "_id": "v4sLtEcMpzabRyfx"
                                 *      },
                                 *      {
                                 *          "name": "Basketball",
                                 *          "category": "Sports",
                                 *          "cost": 100,
                                 *          "rating": 5,
                                 *          "image": "https://i.imgur.com/lulqWzW.jpg",
                                 *          "_id": "upLK9JbQ4rMhTwt4"
                                 *      }
                                 * ]
                                 *
                                 * Example for failed response from backend:
                                 * HTTP 500
                                 * {
                                 *      "success": false,
                                 *      "message": "Something went wrong. Check the backend console for more details"
                                 * }
                                 */




  const performAPICall = async () => {                                              // Defines an asynchronous function 'performAPICall' to make an API call to fetch products. It sets the fetched products to the state variables 'products' and 'filteredProducts'. handles successful responses by updating state variables with product data, and handles errors by displaying appropriate error messages to the user.
    
    setIsLoading(true);                                                             // Sets the 'isLoading' state variable to 'true'. This indicates that the API call is in progress, and loading indicators can be displayed in the UI
    try{                                                                            // This is a try-catch block to handle any errors that might occur during the API call
      const response=await axios.get(`${config.endpoint}/products`);                // Makes a GET request to the specified endpoint (${config.endpoint}/products) using Axios library. The 'await' keyword ensures that the code waits for the response before proceeding further.
      setIsLoading(false);                                                          // Sets the 'isLoading' state variable back to 'false' after the API call is completed. This indicates that the loading process is finished
      // console.log(response.data);
      setProducts(response.data);                                                   // Updates the 'products' state variable with the data received from the API response. This data likely contains the products fetched from the server
      setFilteredProducts(response.data);                                           // Updates the 'filteredProducts' state variable with the same data received from the API response. Initially, this might be the same as 'products', indicating that no filtering has been applied yet
    }
    catch(err){                                                                     // This block catches any errors that occur during the API call or processing of the response
      setIsLoading(false);
      if(err.response && err.response.status===500){                                // Checks if the error is due to a server error (status code 500) or another type of error
        enqueueSnackbar(err.response.data.message,{variant:'error'});               // If the error is due to a server error, it displays a Snackbar with the error message received from the server response
      }
      else{
        enqueueSnackbar('Could not fetch the data.',{variant:'error'});             // If the error is not due to a server error (e.g., network error), it displays a generic error message indicating that data fetching failed
      }
    }
  };

  

                                  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
                                  /**
                                  * Definition for search handler
                                  * This is the function that is called on adding new search keys
                                  *
                                  * @param {string} text
                                  *    Text user types in the search bar. To filter the displayed products based on this text.
                                  *
                                  * @returns { Array.<Product> }
                                  *      Array of objects with complete data on filtered set of products
                                  *
                                  * API endpoint - "GET /products/search?value=<search-query>"
                                  *
                                  */



  // Defines an asynchronous function performSearch to make an API call for searching products based on the provided text. It updates the filteredProducts state variable with the search results. updates state variables with the search results or error messages, and handles different types of errors that may occur during the process
  const performSearch = async (text) => {                                                                // This declares an asynchronous function named 'performSearch' with a parameter 'text'. This function is responsible for making an API call to search for products based on the provided text

    try{                                                                                                 // This is a try-catch block to handle any errors that might occur during the API call
      const response=await axios.get(`${config.endpoint}/products/search?value=${text}`);                // Makes a GET request to the specified search endpoint (${config.endpoint}/products/search) with the search query parameter 'value' set to the provided 'text'. The 'await' keyword ensures that the code waits for the response before proceeding further.
      setFilteredProducts(response.data);                                                                // If the API call is successful, it updates the 'filteredProducts' state variable with the data received from the API response. This data likely contains the products that match the search query.
    }
    catch(err){                                                                                          // This block catches any errors that occur during the API call or processing of the response
      if(err.response){                                                                                  // Checks if the error is related to the server response
        if(err.response.status===404){                                                                   // Checks the status code of the server response to determine the type of error
          setFilteredProducts([]);                                                                       // If the server responds with a status code of 404 (Not Found), it sets the 'filteredProducts' state variable to an empty array. This indicates that no products were found matching the search query
        }
        else if(err.response.status===500){                                                              // Checks the status code of the server response to determine the type of error
          enqueueSnackbar(err.response.message,{variant:'error'});                                       // If the server responds with a status code of 500 (Internal Server Error), it displays a Snackbar with the error message received from the server response
        }
        else{
          enqueueSnackbar('Could not fetch the products.',
          {variant:'error'});                                                                            // If the error is not due to a server error (e.g., network error), it displays a generic error message indicating that product fetching failed
        }
      }
    }
  };




                                // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
                                /**
                                 * Definition for debounce handler
                                 * With debounce, this is the function to be called whenever the user types text in the searchbar field
                                 *
                                 * @param {{ target: { value: string } }} event
                                 *    JS event object emitted from the search input field
                                 *
                                 * @param {NodeJS.Timeout} debounceTimeout
                                 *    Timer id set for the previous debounce call
                                 *
                                 */




  // Defines a function debounceSearch to debounce search input events. It sets a timeout to delay the search action and prevents too many API requests from being made in a short time
  const debounceSearch = (event, debounceTimeout) => {                  // This declares a function named 'debounceSearch' with two parameters: 'event' and 'debounceTimeout'. This function is responsible for debouncing search input events

    const value=event.target.value;                                     // Retrieves the value of the search input field from the 'event' object. This value represents the text entered by the user for searching

    if(debounceTimeout){                                                // Checks if there is an existing debounce timeout ('debounceTimeout')
      clearTimeout(debounceTimeout);                                    // If there is, it clears the timeout using 'clearTimeout'. This is done to ensure that only one timeout is active at a time and to prevent multiple API calls from being made unnecessarily
    }

    const timer=setTimeout(()=>{                                        // Sets a new timeout using 'setTimeout'
      performSearch(value);                                             // Within this timeout, it calls the 'performSearch' function with the 'value' retrieved from the search input. This delayed execution helps in debouncing the search input, i.e., delaying the API call until the user has finished typing
    },500)                                                              // This timeout triggers after 500 milliseconds

    setDebounceTimeout(timer);                                          // Updates the 'debounceTimeout' state variable with the newly created timeout 'timer'. This allows the function to keep track of the current debounce timeout, which can be cleared if needed
  };




                              /**
                               * Perform the API call to fetch the user's cart and return the response
                               *
                               * @param {string} token - Authentication token returned on login
                               *
                               * @returns { Array.<{ productId: string, qty: number }> | null }
                               *    The response JSON object
                               *
                               * Example for successful response from backend:
                               * HTTP 200
                               * [
                               *      {
                               *          "productId": "KCRwjF7lN97HnEaY",
                               *          "qty": 3
                               *      },
                               *      {
                               *          "productId": "BW0jAAeDJmlZCF8i",
                               *          "qty": 1
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




  // 'fetchCart' function is responsible for making an authenticated API call to fetch the user's cart data from the server. It handles various scenarios such as missing token, server errors, and bad requests gracefully by displaying appropriate error messages to the user
  const fetchCart = async (token) => {                                              // This declares an asynchronous function named 'fetchCart' with a parameter 'token'. This function is responsible for fetching the user's cart data from the server
    if (!token) return;                                                             // Checks if the 'token' parameter is falsy (e.g., undefined or null). If it is falsy, the function returns early. This is done to prevent making an API call without a valid token

    try {                                                                           // This is a try-catch block to handle any errors that might occur during the API call
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
      
      const response = await axios.get(`${config.endpoint}/cart`, {                 // Makes a GET request to the specified cart endpoint (${config.endpoint}/cart) using Axios
        headers: {                                                                  // It includes an Authorization header with the provided 'token' to authenticate the user
          'Authorization': `Bearer ${token}`,
        },
      });
      // console.log(response.data,"cartdata");
      setItems(response.data);                                                      // Updates the 'items' state variable with the data received from the API response. This data likely contains the user's cart items
      return response.data;                                                         // Returns the cart data obtained from the API response
    } catch (e) {                                                                   // This block catches any errors that occur during the API call or processing of the response
      if (e.response && e.response.status === 400) {                                // Checks if the error is related to the server response and has a status code of 400 (Bad Request)
        enqueueSnackbar(e.response.data.message, { variant: "error" });             // If the error is due to a Bad Request (status code 400), it displays a Snackbar with the error message received from the server response
      } else {
        enqueueSnackbar(                                                            // If the error is not due to a Bad Request (e.g., network error or server error), it displays a generic error message indicating that cart details couldn't be fetched
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;                                                                 // Returns 'null' to indicate that fetching cart details failed
    }
  };





                              // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
                              /**
                              * Return if a product already is present in the cart
                              *
                              * @param { Array.<{ productId: String, quantity: Number }> } items
                              *    Array of objects with productId and quantity of products in cart
                              * @param { String } productId
                              *    Id of a product to be checked
                              *
                              * @returns { Boolean }
                              *    Whether a product of given "productId" exists in the "items" array
                              *
                              */



                              

  // Defines a function 'isItemInCart' to check if a product is already in the cart
  const isItemInCart = (items, productId) => {                                        // This line declares a function named 'isItemInCart' which takes two parameters: 'items' and 'productId'. The purpose of this function is to check whether a product with a given 'productId' exists in the 'items' array, which likely represents the items in the user's cart
    
    // Returns the result of a comparison operation. It uses the 'findIndex' method to search through the 'items' array to find an item where the 'productId' matches the provided 'productId'
    return items.findIndex((item) => item.productId === productId) !== -1;

    // 'findIndex' iterates over each item in the array and executes the provided callback function "(item) => item.productId === productId" for each item
    // If a matching item is found, 'findIndex' returns the index of that item in the array. If no matching item is found, it returns '-1'
  };





                            /**
                             * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
                             *
                             * @param {string} token
                             *    Authentication token returned on login
                             * @param { Array.<{ productId: String, quantity: Number }> } items
                             *    Array of objects with productId and quantity of products in cart
                             * @param { Array.<Product> } products
                             *    Array of objects with complete data on all available products
                             * @param {string} productId
                             *    ID of the product that is to be added or updated in cart
                             * @param {number} qty
                             *    How many of the product should be in the cart
                             * @param {boolean} options
                             *    If this function was triggered from the product card's "Add to Cart" button
                             *
                             * Example for successful response from backend:
                             * HTTP 200 - Updated list of cart items
                             * [
                             *      {
                             *          "productId": "KCRwjF7lN97HnEaY",
                             *          "qty": 3
                             *      },
                             *      {
                             *          "productId": "BW0jAAeDJmlZCF8i",
                             *          "qty": 1
                             *      }
                             * ]
                             *
                             * Example for failed response from backend:
                             * HTTP 404 - On invalid productId
                             * {
                             *      "success": false,
                             *      "message": "Product doesn't exist"
                             * }
                             */






  // This 'addToCart' function is responsible for adding items to the cart. It checks if the user is logged in, prevents adding duplicate items to the cart if specified, makes a POST request to add the item to the cart, handles errors gracefully, updates the cart items in the state, and logs a message indicating successful addition to the cart.
  const addToCart = async (                                                      // This line declares an asynchronous function named 'addToCart'. It takes several parameters, including 'token', 'items', 'productId', 'products', 'qty', and an optional 'options' object with a default value
    token,
    items,
    productId,
    products,
    qty,
    options = { preventDuplicate: false }
  ) => {
    
    //console.log(qty)
    if (!token) {                                                                // This condition checks if the 'token' parameter is falsy (e.g., undefined or null). If the token is falsy, it means the user is not logged in. In such a case, a Snackbar message is displayed, informing the user to log in before adding items to the cart
      enqueueSnackbar("Please log in to add item to cart", {
        variant: "warning",
      });
      return;
    }

    if (options.preventDuplicate && isItemInCart(items, productId)) {           // This condition checks if the 'preventDuplicate' property of the 'options' object is set to 'true' and if the item with the provided 'productId' already exists in the 'items' array (i.e., it is already in the cart). If both conditions are met, a Snackbar message is displayed, informing the user that the item is already in the cart
      enqueueSnackbar(
        "Item already in cart. Use the cart slidebar to update quantity or remove item.",
        { variant: "warning" },
      );
      return;
    }

    try {                                                                      // This is a try-catch block to handle any errors that might occur during the execution of the code within the try block.
      const response = await axios.post(
        `${config.endpoint}/cart`,                                             // This line sends a POST request to the cart endpoint ('${config.endpoint}/cart') using Axios
        { productId, qty },                                                    // It includes the 'productId' and 'qty' in the request body
        {
          headers: {                                                           // Additionally, it sets the 'Authorization' header with the provided 'token' for authentication
            'Authorization' : `Bearer ${token}`,
          },
        }
      );

      const cartItems = generateCartItemsFrom(response.data, products)        // This line calls a function 'generateCartItemsFrom' with the 'response.data' and 'products' as arguments. It likely generates formatted cart items from the response data and products
      setItems(cartItems)                                                     // This line updates the 'items' state variable with the formatted cart items obtained from the previous step
    } 
    catch (e) {
      if (e.response) {                                                      // Checks if the error is related to the server response
        enqueueSnackbar(e.response.data.message, { variant: "error" });      // It displays a Snackbar with the error message received from the server response
      } else {
        enqueueSnackbar(                                                     // // If the error is not due to a server error, it displays a generic error message
          "Could not fetch products. Check that the backend id=s running,reachable and return valid JSON",
          {
            variant: "error",
          }
        );
      }
    }

    console.log("Added to cart", productId);                                 // This line logs a message to the console indicating that the specified product has been successfully added to the cart
  };








  // This 'useEffect' hook is used for triggering side effects in response to initiates an API call when the component mounts
  useEffect(()=>{                                                                   // It takes two arguments: a callback function and a dependency array
    performAPICall();                                                               // the callback function 'performAPICall()' is executed
  },[]);                                                                            // dependency array '[]' is empty, it indicates that the effect should only run once, immediately after the component is mounted




  // This 'useEffect' hook is used for triggering side effects in response to fetches the user's cart data and updates the cart items whenever there's a change in the 'products' state variable
  useEffect(() => {                                                                 // it takes a callback function and a dependency array
    fetchCart(token)                                                                // Inside the callback function, 'fetchCart(token)' is invoked. This function is likely responsible for fetching the user's cart data from the server

      // The '.then()' method is chained to the 'fetchCart' function call. It takes a callback function that receives the 'cartData' fetched from the server
      
      .then((cartData) => generateCartItemsFrom(cartData, products))                // Within the '.then()' block, 'generateCartItemsFrom(cartData, products)' is invoked. This function likely transforms the raw 'cartData' into formatted cart items using the available 'products' data
      
      //Another '.then()' method is chained to handle the result of 'generateCartItemsFrom'. It receives the formatted 'cartItems'
      .then((cartItems) => setItems(cartItems));                                   // Inside this '.then()' block, 'setItems(cartItems)' is called to update the 'items' state variable with the newly formatted cart items

  }, [products]);                                                                  // The dependency array '[products]' specifies that this effect should re-run whenever the 'products' state variable changes. This likely indicates that the cart items need to be updated whenever there's a change in the available products







  
  return (                                                                // This marks the beginning of the JSX code block that will be returned by the component
    
    //This is a JSX element representing a '<div>' container. All the JSX elements inside it will be enclosed within this '<div>'
    <div>




      {/* This is a custom component or an HTML element representing the header section of the page */}
      <Header>
                                          {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}

        {/* This is a Material-UI component named TextField, used for text input fields. */}
        <TextField
          className="search-desktop"
          size="small"                                                      // This attribute sets the size of the TextField component to small. It controls the overall size of the text field
          InputProps={{                                                     // This attribute allows passing additional properties to the input element inside the TextField component
            endAdornment: (                                                 // This property of InputProps specifies an adornment (content added before, after, or within the input field) positioned at the end of the TextField component

              // This is a Material-UI component named 'InputAdornment', used to add content (such as icons) to the input field. It's positioned at the end of the input field
              <InputAdornment position="end">
                {/* This is likely a custom or predefined Material-UI icon component named Search, representing a search icon. The color="primary" attribute sets the color of the icon to the primary color defined in the theme */}
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          placeholder="Search for items/categories"                            // This attribute sets the placeholder text displayed in the input field when it's empty. It provides a hint or example of what type of information should be entered
          name="search"                                                        // This attribute assigns a name to the input field. This name can be useful when working with forms and form submissions, as it identifies the input field's purpose
          // This attribute specifies the function to be called when the input value changes. It's an event handler triggered by the onChange event of the input field. The provided arrow function calls the debounceSearch function with the event object e and the debounceTimeout variable as arguments
          onChange={(e) => debounceSearch(e, debounceTimeout)}
        />

      </Header>




                                                            {/* Search view for mobiles */}

      
      <TextField
        className="search-mobile"
        size="small"
        fullWidth                                                            // This attribute specifies that the TextField should occupy the full width available within its container. It expands the TextField horizontally to fill the available space
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        onChange={(e) => debounceSearch(e, debounceTimeout)}
      />





      {/* This is a Material-UI component representing a grid container. It provides a layout structure for arranging its child elements in rows and columns */}
      <Grid container>




        {/* This is a grid item within the grid container. It specifies the width of the item on medium-sized screens. If token is truthy, it occupies 9 out of 12 columns; otherwise, it occupies the full width. */}
        <Grid item md={token ? 9 : 12}>

          {/* This is another grid item, which likely contains a group of products displayed in a grid layout */}
          <Grid item className="product-grid">
            <Box className="hero">
              <p className="hero-heading">
                India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
                to your door step
              </p>
            </Box>
          </Grid>






          {/* This is a conditional rendering statement. If 'isLoading' is 'true', it renders a loading indicator; otherwise, it renders the product grid or a message indicating no products found */}
          {isLoading ? (

            // This is a Material-UI component representing a box container with a CSS class name loading. It likely contains a loading indicator and a message indicating that products are being loaded
            <Box className="loading">
              {/* This is a Material-UI component representing a circular progress indicator, often used to indicate that something is in progress */}
              <CircularProgress />
              <h4>Loading Products...</h4>
            </Box>






          ) : (






            // this JSX code block renders a grid layout of product cards if there are products available in the 'filteredProducts' array. If there are no products found, it displays a message indicating so
            <Grid container marginY="1rem" paddingX="1rem" spacing={2}>
              
              {/* This is a conditional rendering statement.
              If 'filteredProducts.length' is truthy (meaning there are products in the array), it renders the first block of JSX; otherwise, it renders the second block */}
              {filteredProducts.length ? (





                // renders the First block of JSX

                // This is a JavaScript 'map()' function applied to the 'filteredProducts' array.
                // It iterates over each product in the array and returns a JSX element for each product.
                filteredProducts.map((product) => (

                  // xs={6} specifies that the item should occupy 6 out of 12 columns on extra-small screens.
                  // md={3} specifies that the item should occupy 3 out of 12 columns on medium-sized screens.
                  // key={product._id} provides a unique identifier for React to efficiently render and update the list of products
                  <Grid item xs={6} md={3} key={product._id}>

                    {/* This is a custom or Material-UI component representing a product card.
                    It receives props such as:
                    'product' (containing the details of the specific product) and 
                    'handleAddToCart' (a function for adding the product to the cart) */}
                    <ProductCard
                      product={product}
                      handleAddToCart={async () =>
                        await addToCart(token, items, product._id, products, 1, { preventDuplicate: true })
                      }
                    />
                  </Grid>
                ))

                // This part of the ternary operator handles the case when 'filteredProducts.length' is falsy (i.e., there are no products found)
              ) : (







                // renders the Second block of JSX

                // It contains a loading indicator or a message indicating no products found
                <Box className="loading">

                  {/* This is likely a custom or predefined Material-UI icon component representing a dissatisfied sentiment */}
                  <SentimentDissatisfied color="action" />
                  <h4 style={{ color: "$636363" }}>No products found</h4>
                </Box>
              )}
            </Grid>



          )}





        </Grid>







        {token ? (
          <Grid item xs={12} md={3} bg="#E9F5E1">
            <Cart products={products} items={items} handleQuantity={addToCart} />
          </Grid>
        ) : null}






      </Grid>




      

      <Footer />
    </div>
  );
};

export default Products;
