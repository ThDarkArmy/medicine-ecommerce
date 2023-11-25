import { Box, Card, Divider, Grid, Typography, Button } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Header from '../components/Header';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Snackbar from "../components/Snackbar";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const BASE_URL = "http://localhost:8000/api/v1";

const MyCart = () => {
    const navigate = useNavigate();
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("");
    const [cartData, setcartData] = useState([]);
    const [placeOrder, setPlaceOrder] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(()=>{
        if(!token){
            navigate("/login-register")
        }
    },[])

    useEffect(()=> {
        loadMyCart()
    },[])

    const removeFromCart = async (id) => {
        try {
            const response = await axios({
                method: 'delete',
                url: `${BASE_URL}/cart/${id}`,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            });
            if (response.data) {
                loadMyCart();
            } else {
                setSnackbarMessage("Couldn't remove cart item");
                setSnackbarSeverity("error");
                setOpenSnackbar(true);

            }
        } catch (error) {
            setSnackbarMessage("Couldn't remove cart item");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
            console.log(error);
        }
    }

    const loadMyCart = async () => {
        try {
            const response = await axios({
                method: 'get',
                url: `${BASE_URL}/cart/`,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            });
            if (response.data) {
                setcartData(response.data.items);
                let totalPrice = 0;
                response.data.items.forEach((item) =>totalPrice += item.product.price*item.quantity);
                setTotalPrice(totalPrice);
            } else {
                setSnackbarMessage("Couldn't load cart items");
                setSnackbarSeverity("error");
                setOpenSnackbar(true);

            }
        } catch (error) {
            setSnackbarMessage("Couldn't load cart items");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
            console.log(error);
        }
    }

    const placeOrderAndMakePayment = async () => {
        const data = cartData.map(item=> { return {productId: item.product.id, quantity: item.quantity}});
        console.log(data);
        try {
            const response = await axios({
                method: 'post',
                url: `${BASE_URL}/orders/`,
                data: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            });
            if (response.data) {
                cartData.map(async (d)=> removeFromCart(d.id));
                navigate("/my-orders");
            } else {
                setSnackbarMessage("Some error occured");
                setSnackbarSeverity("error");
                setOpenSnackbar(true);

            }
        } catch (error) {
            setSnackbarMessage("Some error occured");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
            console.log(error);
        }
    }

    return (
        <div>
            <Header />
            <Box sx={{ mt: 10, padding: 2, mb: 50 }}>
              {cartData?.length>0 ?  <Grid container spacing={3}>
                    <Grid item xs={8}>
                        <Box sx={{ padding: 1, bgcolor: "#fff", mb:1 }}>
                            <Typography component="div">Cart Items</Typography>
                        </Box>
                        <Box >
                            {cartData && cartData.map(item =>
                                <Card sx={{ display: 'flex', mb:2 }}>
                                    <CardMedia
                                        component="img"
                                        sx={{ width: 200 }}
                                        image={item.product.imageUrl}
                                        alt="Live from space album cover"
                                    />
                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                        <CardContent sx={{ flex: '1 0 auto' }}>
                                            <Typography component="div" variant="h5">
                                                {item.product.name}
                                            </Typography>
                                            <Typography sx={{fontSize: 14}} color="text.secondary" component="div">
                                                {`Quantity: ${item.quantity}`}
                                            </Typography>
                                            <Typography sx={{fontSize: 14}}  variant="subtitle1" color="text.secondary" component="div">
                                            {`Price: ${item.quantity*item.product.price}`}
                                            </Typography>
                                        </CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1, mt:1 }}>
                                            <Button onClick={()=> removeFromCart(item.id)} sx={{color: "orange"}}>Remove</Button>
                                        </Box>
                                    </Box>

                                </Card>
                            )}
                        </Box>
                        {cartData?.length>0 && <Box sx={{ padding: 1, bgcolor: "#fff", display: "flex" }}>
                            <Box sx={{flexGrow: 1}}>
                            </Box>
                            <Button onClick={()=> setPlaceOrder(true)} sx={{bgcolor: "#FB641B", height: 50, width: 200}}  variant='contained'>Place Order</Button>
                        </Box>}
                    </Grid>
                    <Grid item xs={4}>
                        <Box sx={{ bgcolor: "#fff", paddingLeft: 2, paddingRight: 2 }}>
                            <Box sx={{ paddingTop: 2, paddingBottom: 2 }}>
                                <Typography>PRICE DETAILS</Typography>
                            </Box>
                            <Divider />
                            <Box SX={{ paddingTop: 2 }}>
                                <Box sx={{ paddingTop: 2, paddingBottom: 2, bgColor: "#fff", display: "flex" }}>
                                    <Typography>Price</Typography>
                                    <Typography sx={{ ml: "auto" }}>{totalPrice}</Typography>
                                </Box>
                                <Box sx={{ paddingTop: 2, paddingBottom: 2, bgColor: "#fff", display: "flex" }}>
                                    <Typography>Discount</Typography>
                                    <Typography sx={{ ml: "auto", color: "green" }}>{Math.round(totalPrice*7/100)}</Typography>
                                </Box>
                                <Box sx={{ paddingTop: 2, paddingBottom: 2, bgColor: "#fff", display: "flex" }}>
                                    <Typography>Delivery Charge</Typography>
                                    <Typography sx={{ ml: "auto" }}>40</Typography>
                                </Box>
                            </Box>
                            <Divider />
                            <Box sx={{ paddingTop: 2, paddingBottom: 2, bgColor: "#fff", display: "flex" }}>
                                <Typography sx={{ fontWeight: 600 }}>Total Amount</Typography>
                                <Typography sx={{ ml: "auto", fontWeight: 600 }}>{totalPrice+40-Math.round(totalPrice*7/100)}</Typography>
                            </Box>
                            <Divider />
                            <Box sx={{ paddingTop: 2, paddingBottom: 2, bgColor: "#fff", display: "flex" }}>
                                <Typography sx={{ color: "green" }}>You will save {Math.round(totalPrice*7/100)} in this order</Typography>

                            </Box>
                            <Box sx={{ padding: 1, bgcolor: "#fff", display: "flex" }}>
                            {placeOrder && <Button onClick={()=> placeOrderAndMakePayment()} fullWidth sx={{bgcolor: "#FB641B", height: 50}}  variant='contained'>Make Payment</Button>}
                        </Box>
                        </Box>
                    </Grid>
                </Grid>: <Box sx={{display: "flex", justifyContent: "center", alignItems: "center"}}> <Typography sx={{fontSize: 25}}>Your cart is empty!</Typography> </Box>}
            </Box>
            <Snackbar openSnackbar={openSnackbar} setOpenSnackbar={setOpenSnackbar} snackbarMessage={snackbarMessage} snackbarSeverity={snackbarSeverity} />
        </div>
    )
}

export default MyCart