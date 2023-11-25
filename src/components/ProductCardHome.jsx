import React from 'react';
import { Card, CardActionArea, CardMedia, CardContent, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ProductCardHome = ({ product }) => {
    const navigate = useNavigate();
    return (
        <>
            <Card sx={{minWidth:300, maxWidth: 300, height: 350 }} onClick={()=> navigate(`/product/${product.id}?pid=${Math.random()}`)}>
                <CardActionArea>
                    <CardMedia
                        component="img"
                        height="200"
                        width="300"
                        image={product.imageUrl}
                        alt={product.name}
                    />
                    <CardContent display="flex" flexDirection="column">
                        <Typography gutterBottom variant="h5" component="div">
                            {product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {product.description}
                        </Typography>
                        <Typography variant="h6" component="div" sx={{mt: 2}}>
                        ₹{product.price}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </>
    )
}

export default ProductCardHome