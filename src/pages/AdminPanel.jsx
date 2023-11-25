import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import axios from "axios";

import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  TextField,
  Typography,
  CardContent,
  Card,
  Select,
  MenuItem,
  Divider,
  Grid,
  CardMedia
} from "@mui/material";
import { styled } from "@mui/material/styles";
import MuiAlert from "@mui/material/Alert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Snackbar from "../components/Snackbar";


import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:8000/api/v1";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const AdminPanel = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const [openEditForm, setOpenEditForm] = useState(false);
  const [openAddForm, setOpenAddForm] = useState(false);
  const [openSuccessSnack, setOpenSuccessSnack] = useState(false);
  const [openErrorSnack, setOpenErrorSnack] = useState(false);
  const [successMsg, setSuccessMsg] = useState();
  const [errorMsg, setErrorMsg] = useState();
  const [products, setproducts] = useState();
  const [productId, setproductId] = useState();
  const [stock, setstock] = useState("");
  const [brand, setbrand] = useState("");
  const [image, setimage] = useState("");
  const [category, setcategory] = useState("");
  const [description, setdescription] = useState("");
  const [users, setusers] = useState([]);

  const [name, setname] = useState("");
  const [expiryDate, setexpiryDate] = useState("");
  const [price, setprice] = useState("");

  const [showValidationError, setshowValidationError] = useState(false);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");

  useEffect(()=> {
    if(!token){
      navigate("/login-register");
  }
    if(role==="VENDOR"){
      navigate("/vendor-panel");
    }else if(role==="USER"){
      navigate("/");
    }
},[])

  const approveProduct = async (id) => {
      let status = 'APPROVED';
      try {
          const response = await axios({
              method: 'put',
              url: `${BASE_URL}/products/approve/${id}`,
              data: JSON.stringify({status: status}),
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          });
          if (response.data) {
              setSnackbarMessage("Product approved successfully");
              setSnackbarSeverity("success");
              setOpenSnackbar(true);
              loadProducts();
          } else {
              setSnackbarMessage("Product couldn't approved");
              setSnackbarSeverity("error");
              setOpenSnackbar(true);
          }
      } catch (error) {
          setSnackbarMessage("Product couldn't approved");
          setSnackbarSeverity("error");
          setOpenSnackbar(true);
          console.log(error);
      }
  }


  const deleteProduct = async (productId) => {
    try {
      const response = await axios({
        method: "delete",
        url: BASE_URL + "/products/" + productId,
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      if (response.data) {
        setOpenSuccessSnack(true);
        setSuccessMsg("Product deleted successfully");
        setOpenEditForm(false);
        let prd = products.filter((product) => product.id !== productId);
        setproducts(prd);
        setname("");
        setprice("");
        setexpiryDate("");
      }
    } catch (err) {
      console.log(err);
      setOpenErrorSnack(true);
      setErrorMsg("Error occured while deleting product");
    }
  };


  const loadProducts = async () => {
      try {
        const response = await axios({
          method: "get",
          url: BASE_URL + "/products/all",
          headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + token,
          }
        });
        if (response.data) {
          setproducts(response.data)
        }
      } catch (err) {
        console.log(err);
        setOpenErrorSnack(true);
        setErrorMsg("Error occured while adding product");
      }
  };

  const loadUsers = async () => {
    try {
      const response = await axios({
        method: "get",
        url: BASE_URL + "/users/all",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + token,
        }
      });
      if (response.data) {
        setusers(response.data)
      }
    } catch (err) {
      console.log(err);
      setOpenErrorSnack(true);
      setErrorMsg("Error occured while loading users");
    }
};

const deleteUser = async (id) => {
  try {
    const response = await axios({
      method: "delete",
      url: BASE_URL + "/users/"+id,
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + token,
      }
    });
    if (response.data) {
      setOpenSuccessSnack(true);
      setSuccessMsg("User deleted successfully");
    }
  } catch (err) {
    console.log(err);
    setOpenErrorSnack(true);
    setErrorMsg("Error occured while deleteing users");
  }
};


  useEffect(() => {
   loadProducts();
   loadUsers();
  }, []);


  return (
    <div>
      <Header />
      <Box sx={{mt: 9, padding: 1}}>

        <Box sx={{ mt: 5, mb: 1 }}>
      
            <Snackbar openSnackbar={openSnackbar} setOpenSnackbar={setOpenSnackbar} snackbarMessage={snackbarMessage} snackbarSeverity={snackbarSeverity} />
          <Box display="flex">
            <Typography variant="h5" color="initial">
              Products
            </Typography>
          </Box>
          <Box sx={{ mt: 2, overflowX:"auto" }}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Product (Id)</StyledTableCell>
                    <StyledTableCell align="right">Name</StyledTableCell>
                    <StyledTableCell align="right">Expiry Date</StyledTableCell>
                    <StyledTableCell align="right">
                      Price
                    </StyledTableCell>
                    <StyledTableCell align="right">Brand</StyledTableCell>
                    <StyledTableCell align="right">Stock</StyledTableCell>
                    <StyledTableCell align="right">Category</StyledTableCell>
                    <StyledTableCell align="right">Status</StyledTableCell>
                    <StyledTableCell align="right">Actions</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products &&
                    products.map((row) => (
                      <StyledTableRow key={row.id}>
                        <StyledTableCell component="th" scope="row">
                          {row.id}
                        </StyledTableCell>
                        <StyledTableCell
                          align="right"
                          component="th"
                          scope="row"
                        >
                          {row.name}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.expiryDate}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.price}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.brand}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.stock}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.category}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.approved?"Approved": "Not Approved"}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          <EditIcon
                            titleAccess="Approve"
                            sx={{ cursor: "pointer" }}
                            onClick={() => approveProduct(row.id)}
                          />
                          <DeleteIcon
                            titleAccess="Delete"
                            sx={{ cursor: "pointer", ml: 2 }}
                            onClick={() => deleteProduct(row.id)}
                          />
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Box display="flex" sx={{mt: 5}}>
            <Typography variant="h5" color="initial">
              Users
            </Typography>
          </Box>
          <Box sx={{ mt: 2, overflowX:"auto" }}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>User (Id)</StyledTableCell>
                    <StyledTableCell align="right">Name</StyledTableCell>
                    <StyledTableCell align="right">Contact No.</StyledTableCell>
                    <StyledTableCell align="right">
                      Email
                    </StyledTableCell>
                    <StyledTableCell align="right">Address</StyledTableCell>
                    <StyledTableCell align="right">Role</StyledTableCell>
                    <StyledTableCell align="right">Actions</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users &&
                    users.map((row) => (
                      <StyledTableRow key={row.id}>
                        <StyledTableCell component="th" scope="row">
                          {row.id}
                        </StyledTableCell>
                        <StyledTableCell
                          align="right"
                          component="th"
                          scope="row"
                        >
                          {row.name}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.contactNumber}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.email}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.address}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.role}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          <DeleteIcon
                            titleAccess="Delete"
                            sx={{ cursor: "pointer", ml: 2 }}
                            onClick={() => deleteUser(row.id)}
                          />
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Box>
    </div>
  )
}

export default AdminPanel;