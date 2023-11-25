import { Box, Card, Divider, Grid, Typography, Button } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Header from '../components/Header';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Snackbar from "../components/Snackbar";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const BASE_URL = "http://localhost:8000/api/v1";

const MyOrders = () => {
    const navigate = useNavigate();
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("");
    const [orderData, setorderData] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(()=> {
        if(!token){
            navigate("/");
        }
    },[])

    useEffect(()=> {
        loadMyOrders()
    },[])

    const loadMyOrders = async () => {
        try {
            const response = await axios({
                method: 'get',
                url: `${BASE_URL}/orders/`,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            });
            if (response.data) {
                const data = response.data.filter(item=> item.orderItems.length > 0)
                setorderData(data);
                let totalPrice=0;
                response.data.map(item=> item.orderItems.map((d)=>{ 
                    if(d.status !== 'CANCELLED'){
                        totalPrice+=d.product.price*d.quantity
                    }
                    }))
                setTotalPrice(totalPrice);
            } else {
                setSnackbarMessage("Couldn't load orders");
                setSnackbarSeverity("error");
                setOpenSnackbar(true);
            }
        } catch (error) {
            setSnackbarMessage("Couldn't load orders");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
            console.log(error);
        }
    }

    const cancelOrder = async (id) => {
        let status = 'CANCELLED';
        try {
            const response = await axios({
                method: 'put',
                url: `${BASE_URL}/orders/${id}`,
                data: JSON.stringify({status: status}),
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            });
            if (response.data) {
                setSnackbarMessage("Order cancelled successfully");
                setSnackbarSeverity("success");
                setOpenSnackbar(true);
            } else {
                setSnackbarMessage("Order couldn't cancelled");
                setSnackbarSeverity("error");
                setOpenSnackbar(true);
            }
        } catch (error) {
            setSnackbarMessage("Order couldn't cancelled");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
            console.log(error);
        }
    }

    return (
        <div>
            <Header />
            <Box sx={{ mt: 10, padding: 2, mb: 50 }}>
              {orderData?.length>0 ?  <Grid container spacing={3}>
                    <Grid item xs={8}>
                        <Box sx={{ padding: 1, bgcolor: "#fff", mb:1 }}>
                            <Typography component="div">Ordered Items</Typography>
                        </Box>
                        <Box >
                            {orderData && orderData.map(order=> order.orderItems.map((item =>
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
                                            <Typography sx={{fontSize: 14, color: "green"}}  variant="subtitle1" color="text.secondary" component="div">
                                            {`Status: ${item.status}`}
                                            </Typography>
                                        </CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1, mt:1 }}>
                                            <Button disabled={item.status==="CANCELLED"} onClick={()=> cancelOrder(item.id)} sx={{color: "orange"}}>Cancel</Button>
                                        </Box>
                                    </Box>
                                </Card>
                            )))}
                        </Box>
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
                                <Typography sx={{ color: "green" }}>You saved {Math.round(totalPrice*7/100)} in this order</Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>: <Box sx={{display: "flex", justifyContent: "center", alignItems: "center"}}> <Typography sx={{fontSize: 25}}>Your cart is empty!</Typography> </Box>}
            </Box>
            <Snackbar openSnackbar={openSnackbar} setOpenSnackbar={setOpenSnackbar} snackbarMessage={snackbarMessage} snackbarSeverity={snackbarSeverity} />
        </div>
    )
}

export default MyOrders;