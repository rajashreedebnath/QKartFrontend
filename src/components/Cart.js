import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Button, IconButton, Stack } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useHistory } from "react-router-dom";
import "./Cart.css";





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
                                          * Returns the complete data on all products in cartData by searching in productsData
                                          *
                                          * @param { Array.<{ productId: String, qty: Number }> } cartData
                                          *    Array of objects with productId and quantity of products in cart
                                          * 
                                          * @param { Array.<Product> } productsData
                                          *    Array of objects with complete data on all available products
                                          *
                                          * @returns { Array.<CartItem> }
                                          *    Array of objects with complete data on products in cart
                                          *
                                          */










export const generateCartItemsFrom = (cartData, productsData) => {                                    // This function takes two arguments: 'cartData' (an array representing cart items) and 'productsData' (an array representing product data)
  
  if (!cartData) return;                                                                              // This line checks if 'cartData' is falsy (null, undefined, empty array, etc.). If 'cartData' is falsy, the function returns early without further processing.

  const nextCart = cartData.map((item) => ({                                                          // This line creates a new array 'nextCart' by mapping over each item in the 'cartData' array.
    ...item,                                                                                          // For each item in 'cartData', it spreads the item's properties using the spread operator ('...item')
    ...productsData.find((product) => item.productId === product._id),                                // It also finds the corresponding product data for the item based on the matching 'productId' using the 'find' method on 'productsData'. The spread operator is then used again to merge the item properties with the found product data
  }));

  return nextCart;
};









                                        /**
                                         * Get the total value of all products added to the cart
                                         *
                                         * @param { Array.<CartItem> } items
                                         *    Array of objects with complete data on products added to the cart
                                         *
                                         * @returns { Number }
                                         *    Value of all items in the cart
                                         *
                                         */








export const getTotalCartValue = (items = []) => {                                        // It defines a function that takes an array parameter 'items', with a default value of an empty array in case no items are provided
  if (!items.length) return 0;                                                            // If the array is empty ('!items.length' evaluates to 'true'), indicating that there are no items in the cart, the function returns 0

  const total = items
    .map((item) => item.cost * item.qty)                                                  // This line maps over each item in the 'items' array and calculates the cost of each item by multiplying its 'cost' property with its 'qty' (quantity). The result is an array of the costs of individual items in the cart.
    
    
    // After mapping over the items array and obtaining an array of costs, this line reduces (or aggregates) those costs into a single total value.
    
    // The 'reduce()' function takes two arguments: a callback function and an initial value ('total' in this case).
    // The callback function takes two parameters: the accumulated total ('total') and the current value ('n') being processed.
    // For each item's cost ('n'), it adds it to the accumulated total ('total'), starting from the initial value of '0'.
    .reduce((total, n) => total + n);

  return total;                          // Finally, this line returns the calculated total value of all items in the cart
};









                                        /**
                                         * Component to display the current quantity for a product and + and - buttons to update product quantity on cart
                                         * 
                                         * @param {Number} value
                                         *    Current quantity of product in cart
                                         * 
                                         * @param {Function} handleAdd
                                         *    Handler function which adds 1 more of a product to cart
                                         * 
                                         * @param {Function} handleDelete
                                         *    Handler function which reduces the quantity of a product in cart by 1
                                         * 
                                         * 
                                         */









const ItemQuantity = ({                     // This line defines a functional component named ItemQuantity. It takes an object as an argument with properties value, handleAdd, handleDelete, and isReadOnly
  
  // These properties represent the current quantity value, functions to handle adding and deleting quantity, and a flag indicating whether the quantity control should be read-only, respectively
  value,
  handleAdd,
  handleDelete,
  isReadOnly = false,
}) => {

  if (isReadOnly) {                       // This line checks if 'isReadOnly' is true
    return <Box>Qty: {value}</Box>;       // If 'isReadOnly' is true, it returns a Box component displaying the quantity value ('value')
  }


  return (                                                                        // This line starts the return of the component's JSX content
    
    // This line creates a Stack component with a direction of row and aligns items along the center vertically
    <Stack direction="row" alignItems="center"> 
      


      {/* This line creates an IconButton component and attaches the 'handleDelete' function to the onClick event.
        Clicking this button triggers the function to handle deleting the quantity */}
      <IconButton size="small" color="primary" onClick={handleDelete}>
        <RemoveOutlined />          {/* This line renders an icon representing a decrease action (e.g., remove or subtract) */}
      </IconButton>




      {/* This line creates a Box component.
        It displays the current quantity value ('value') */}
      <Box padding="0.5rem" data-testid="item-qty">
        {value}
      </Box>



      {/* This line creates another IconButton component and attaches the 'handleAdd' function to the onClick event.
        Clicking this button triggers the function to handle adding the quantity */}
      <IconButton size="small" color="primary" onClick={handleAdd}>
        <AddOutlined />             {/* This line renders an icon representing an increase action (e.g., add or increment) */}
      </IconButton>


    </Stack>
  );
};











                                              /**
                                               * Component to display the Cart view
                                               * 
                                               * @param { Array.<Product> } products
                                               *    Array of objects with complete data of all available products
                                               * 
                                               * @param { Array.<Product> } items
                                               *    Array of objects with complete data on products in cart
                                               * 
                                               * @param {Function} handleDelete
                                               *    Current quantity of product in cart
                                               * 
                                               * 
                                               */











// The 'Cart' component is responsible for rendering the contents of the shopping cart.
// It checks if the cart is empty and displays an appropriate message if it is.
// If there are items in the cart, it renders the cart contents.
// The component also initializes the 'history' object for navigation and retrieves the authentication token from local storage for authenticated requests.

const Cart = ({                                             // This line defines a functional component named 'Cart'. It takes an object as an argument with properties
  products,                 // 'products' represents an array of product data
  items = [],               // 'items' represents an array of items in the cart, with a default value of an empty array
  handleQuantity,           // 'handleQuantity' is a function to handle changes in item quantity
  isReadOnly = false,       // 'isReadOnly' is a boolean indicating whether the cart is in a read-only state, with a default value of 'false'
}) => {



  const history = useHistory();                           // This line initializes the 'history' object using the 'useHistory' hook from React Router. It allows the component to navigate programmatically to different routes
  const token = localStorage.getItem("token");            // This line retrieves the authentication token stored in the browser's local storage. The token is typically used for authenticated requests to the server




  if (!items.length) {                                            // This line checks if the 'items' array is empty ('!items.length` evaluates to `true'), indicating that there are no items in the cart, the following block of code executes
    

    return (                                                      // This line starts the return statement for the JSX content of the component
      <Box className="cart empty">                                {/* It represents the container for displaying an empty cart message */}
        <ShoppingCartOutlined className="empty-cart-icon" />      {/* This line renders an icon representing an empty shopping cart. */}
        <Box color="#aaa" textAlign="center">                             {/* It contains the message informing the user that the cart is empty and prompts them to add more items to proceed to checkout */}
          Cart is empty. Add more items to the cart to checkout.
        </Box>
      </Box>
    );


  }






  return (                                                  // This line starts the return statement for the JSX content of the component
    <>                                                      {/* These are shorthand syntax for a fragment. Fragments allow you to return multiple elements without needing to wrap them in a parent DOM element */}
      <Box className="cart">                                {/* It represents the container for displaying the cart items */}
        
        
                                            {/* TODO: CRIO_TASK_MODULE_CART - Display view for each cart item with non-zero quantity */}
        
        {items.map((item) => (                               // This line iterates over each item in the 'items' array using the 'map' function
          <Box key={item.productId}>                         {/* This line creates a Box component with a unique key set to the 'productId' of the item */}
            
            {item.qty > 0 ? (                                // This line checks if the quantity of the current item ('item.qty') is greater than 0. If true, it renders the content inside the parentheses, otherwise, it renders 'null'
              
              
              
              <Box display="flex" alignItems="flex-start" padding="1rem">
                
                
                <Box className="image-container">
                  <img
                    src={item.image}
                    alt={item.name}
                    width="100%"
                    height="100%"
                  />
                </Box>


                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-between"
                  height="6rem"
                  paddingX="1rem"
                  >


                  <div>{item.name}</div>                           {/* This line renders the name of the current item inside a div element */}



                  {/* This Box is used for containing the quantity and cost information of the item */}
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    >



                    {/* This line renders the 'ItemQuantity' component, which is responsible for displaying and managing the quantity of the item in the cart */}
                    <ItemQuantity
                      isReadOnly={isReadOnly}
                      value={item.qty}
                      handleAdd={async () => {
                        await handleQuantity(
                          token,
                          items,
                          item.productId,
                          products,
                          item.qty + 1
                        );
                      }}
                      handleDelete={async () => {
                        await handleQuantity(
                          token,
                          items,
                          item.productId,
                          products,
                          item.qty - 1
                        );
                      }}
                      
                    />


                    {/* This line renders the cost of the current item inside a Box component */}
                    <Box padding="0.5rem" fontWeight="700">
                      ${item.cost}
                    </Box>



                  </Box>
                </Box>
              </Box>



            ) : null}



          </Box>
        ))}


        
        <Box
          padding="1rem"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          >
          
          <Box color="#3C3C3C" alignSelf="center">
            Order total
          </Box>

          <Box
            color="#3C3C3C"
            fontWeight="700"
            fontSize="1.5rem"
            alignSelf="center"
            data-testid="cart-total"
            >
            
            {/* dynamically renders the total value of items in the cart by invoking the 'getTotalCartValue' function and passing the 'items' array as an argument */}
            ${getTotalCartValue(items)}

          </Box>
        </Box>

        {!isReadOnly && (                             // checks if the 'isReadOnly' prop is false. If it's false, the following content will be rendered
          
          <Box display="flex" justifyContent="flex-end" className="cart-footer">
            
            <Button
              color="primary"
              variant="contained"
              startIcon={<ShoppingCart />}
              className="checkout-btn"
              onClick={() => {
                history.push("/checkout");
              }}
              >
              Checkout
            </Button>
            
          </Box>
        )}
      </Box>
    </>
  );
};

export default Cart;
