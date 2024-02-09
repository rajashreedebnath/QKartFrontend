import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";








const ProductCard = ({ product, handleAddToCart }) => {
  return (
    <Card className="card">
      <CardMedia component={'img'} alt={product.name} src={product.image}/>
      <CardContent>
        <Typography>{product.name}</Typography>
        <Typography fontWeight="700">${product.cost}</Typography>
        <Rating
        value={product.rating}
        precision={0.5}
        readOnly
        />
      </CardContent>

      <CardActions>
        
        {/* creates a Button component for adding the product to the cart */}
        <Button
          className="card-button"
          startIcon={<AddShoppingCartOutlined/>}
          fullWidth
          variant="contained"

          // onClick event handler that invokes the handleAddToCart function when clicked
          onClick={handleAddToCart}
        >
          Add to cart
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
