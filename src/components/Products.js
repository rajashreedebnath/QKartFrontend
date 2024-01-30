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


const Products = () => {

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  // const [products,setProducts]=useState([]);
  const [isLoading,setLoading]=useState(false);
  const {enqueueSnackbar}=useSnackbar();
  const [filteredProducts,setFilteredProducts]=useState([])
  const [debounceTimeout,setDebounceTimeout]=useState(null);
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
  const performAPICall = async () => {
    setLoading(true);
    try{
      const res=await axios.get(`${config.endpoint}/products`);
      console.log(res.data)
      setFilteredProducts(res.data);
    }
    catch(err){
      if(err.response && err.response.status===500){
        enqueueSnackbar(err.response.data.message,{variant:'error'});
      }
      else{
        enqueueSnackbar('Could not fetch the data.',{variant:'error'});
      }
    }
    finally{
      setLoading(false);
    }
  };

  useEffect(()=>{
    performAPICall();
  },[])

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
  const performSearch = async (text) => {
    try{
      const res=await axios.get(`${config.endpoint}/products/search?value=${text}`);
      setFilteredProducts(res.data);
    }
    catch(err){
      if(err.response){
        if(err.response.status===404){
          setFilteredProducts([]);
        }
        else if(err.response.status===500){
          enqueueSnackbar(err.response.message,{variant:'error'});
        }
        else{
          enqueueSnackbar('Could not fetch the products.',
          {variant:'error'})
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
  const debounceSearch = (event, debounceTimeout) => {
    const value=event.target.value;

    if(debounceTimeout){
      clearTimeout(debounceTimeout);
    }

    const timer=setTimeout(()=>{
      performSearch(value);
    },500)

    setDebounceTimeout(timer);

  };

  const product = {
    name: "Tan Leatherette Weekender Duffle",
    category: "Fashion",
    cost: 150,
    rating: 4.5,
    image:
      "https://crio-directus-assets.s3.ap-south-1.amazonaws.com/ff071a1c-1099-48f9-9b03-f858ccc53832.png",
    _id: "PmInA797xJhMIPti",
  };







  return (
    <div>
      <Header>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
        <Box>
          <TextField
            className="search-desktop"
            size="small"
            sx={{ width: "45vw" }}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Search color="primary" />
                </InputAdornment>
              ),
            }}
            placeholder="Search for items/categories"
            name="search"
            onChange={(e)=>debounceSearch(e,debounceTimeout)}
          />
        </Box>
        
      </Header>

      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        onChange={(e)=>debounceSearch(e,debounceTimeout)}
      />
      <Grid container>
        <Grid item className="product-grid">
          <Box className="hero">
            <p className="hero-heading">
              India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
              to your door step
              </p>
          </Box>
        </Grid>



        <Grid container spacing={4}  padding={2} >
          {isLoading ? <Box className='loading'>
            <CircularProgress/>
            <h4>Loading products...</h4>
            </Box>
            :
            <>
            {filteredProducts.map((item,index)=>
            <Grid item xs={12} md={3} sm={6} key={index}>
              <ProductCard product={item} />
            </Grid>
            )}
            </>
          }
          {filteredProducts.length===0 && !isLoading &&
          <Box className='loading'>
            <SentimentDissatisfied />
            <h4 style={{color:'red'}}>No products found</h4>
          </Box>}
        </Grid>



         
      </Grid>
      <Footer />
    </div>
  );
};

export default Products;
