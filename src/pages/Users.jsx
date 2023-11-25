import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import axios from "axios";
import BackgroundMain from "../images/bg-main.jpeg";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Snackbar,
  TextField,
  Typography
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

const Users = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const [openEditForm, setOpenEditForm] = useState(false);
  const [openAddForm, setOpenAddForm] = useState(false);
  const [openSuccessSnack, setOpenSuccessSnack] = useState(false);
  const [openErrorSnack, setOpenErrorSnack] = useState(false);
  const [successMsg, setSuccessMsg] = useState();
  const [errorMsg, setErrorMsg] = useState();
  const [users, setusers] = useState();
  const [userId, setuserId] = useState();

  const [showValidationError, setshowValidationError] = useState(false);
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [contactNumber, setcontactNumber] = useState("");
  const [password, setpassword] = useState("");

  useEffect(() => {
    if(!token){
      navigate("/login-register");
    }
  }, [])


  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await axios({
        method: "get",
        url: BASE_URL + "/users/all",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      if (response.data) {
        let filteredUsers = response.data.filter((user) => {
          if (user.role && user.role.toUpperCase() !== "ADMIN") {
            return user;
          }
        });
        setusers(filteredUsers);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const editUser = async ()=> {
    if (name === "" || email === "" || contactNumber === "" || password === "") {
        setshowValidationError(true);
      } else {
        const userData = { name, email, contactNumber, role: "USER", password };
        try {
          const response = await axios({
            method: "put",
            url: BASE_URL + "/users/update/"+userId,
            data: JSON.stringify(userData),
            headers: { "Content-Type": "application/json" , Authorization: "Bearer " + token,},
          });
  
          if (response.data) {
            setOpenSuccessSnack(true);
            setSuccessMsg("User updated successfully");
            setOpenEditForm(false);
           
            loadUsers();
            setname("");
            setemail("");
            setcontactNumber("");
          }
        } catch (err) {
          console.log(err.response);
          setOpenErrorSnack(true);
          setErrorMsg("Error occured while updating user");
        }
      }

  }

  const addUser = async ()=> {
    if (name === "" || email === "" || contactNumber === "" || password === "") {
        setshowValidationError(true);
      } else {
        const userData = { name, email, contactNumber, role: "USER", password };
        try {
          const response = await axios({
            method: "post",
            url: BASE_URL + "/users/signup",
            data: JSON.stringify(userData),
            headers: { "Content-Type": "application/json" },
          });
  
          if (response.data) {
            setOpenSuccessSnack(true);
            setSuccessMsg("User added successfully");
            setOpenAddForm(false);
           
            setusers([...users, response.data]);
            setname("");
            setemail("");
            setcontactNumber("");
          }
        } catch (err) {
          console.log(err.response);
          setOpenErrorSnack(true);
          setErrorMsg("Error occured while adding user");
        }
      }

  }

  const deleteUser = async (id)=> {
    try {
        const response = await axios({
          method: "delete",
          url: BASE_URL + "/users/"+id,
          headers: { "Content-Type": "application/json" , Authorization: "Bearer " + token,},
        });

        if (response.data) {
          setOpenSuccessSnack(true);
          setSuccessMsg("User deleted successfully");
          setOpenEditForm(false);
         
          loadUsers();
        }
      } catch (err) {
        console.log(err.response);
        setOpenErrorSnack(true);
        setErrorMsg("Error occured while deleting user");
      }
  }

  const handleOpenEditForm = (user) => {
    setOpenEditForm(true);
    setuserId(user.id);
    setname(user.name);
    setemail(user.email);
    setcontactNumber(user.contactNumber);
  };

  const handleOpenAddForm = () => {
    setOpenAddForm(true);
  };

  return (
    <div>
      <Header />
      <Dialog open={openEditForm} onClose={() => setOpenEditForm(false)}>
          <DialogTitle>Edit User</DialogTitle>
          <DialogContent>
            {showValidationError && (
              <Alert severity="error">All the fields are mandatory</Alert>
            )}
            <TextField
              size="small"
              label="name"
              fullWidth
              value={name}
              onChange={(e) => {
                setshowValidationError(false);
                setname(e.target.value);
              }}
              sx={{ mt: 2 }}
            />
            <TextField
              size="small"
              label="Contact Number"
              type="number"
              value={contactNumber}
              fullWidth
              onChange={(e) => {
                setshowValidationError(false);
                setcontactNumber(e.target.value);
              }}
              sx={{ mt: 2 }}
            />
            <TextField
              size="small"
              label="Email"
              fullWidth
              value={email}
              type="email"
              onChange={(e) => {
                setshowValidationError(false);
                setemail(e.target.value);
              }}
              sx={{ mt: 2 }}
            />
            <TextField
              size="small"
              label="Password"
              fullWidth
              value={password}
              type="password"
              onChange={(e) => {
                setshowValidationError(false);
                setpassword(e.target.value);
              }}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEditForm(false)}>Cancel</Button>
            <Button onClick={editUser}>Update</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openAddForm} onClose={() => setOpenAddForm(false)}>
          <DialogTitle>Add User</DialogTitle>
          <DialogContent>
            {showValidationError && (
              <Alert severity="error">All the fields are mandatory</Alert>
            )}
            <TextField
              size="small"
              label="Name"
              fullWidth
              onChange={(e) => {
                setshowValidationError(false);
                setname(e.target.value);
              }}
              sx={{ mt: 2 }}
            />
            <TextField
              size="small"
              label="Contact Number"
              fullWidth
              type="number"
              onChange={(e) => {
                setshowValidationError(false);
                setcontactNumber(e.target.value);
              }}
              sx={{ mt: 2 }}
            />
            <TextField
              size="small"
              label="Email"
              fullWidth
              type="email"
              onChange={(e) => {
                setshowValidationError(false);
                setemail(e.target.value);
              }}
              sx={{ mt: 2 }}
            />
            <TextField
              size="small"
              label="Password"
              fullWidth
              value={password}
              type="password"
              onChange={(e) => {
                setshowValidationError(false);
                setpassword(e.target.value);
              }}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAddForm(false)}>Cancel</Button>
            <Button onClick={addUser}>Add User</Button>
          </DialogActions>
        </Dialog>
      <Box sx={{ marginTop: 8, marginLeft: 0, marginRight: 0 }}>
        <Box
          component="img"
          sx={{
            width: "100%",
            height: "400px",
          }}
          alt="The house from the offer."
          src={BackgroundMain}
        />

        <Box
          sx={{
            paddingRight: 5,
            marginTop: 4,
            marginLeft: 2,
          }}
        >
          <Box sx={{ pl: 5 }} display="flex">
            <Typography variant="h5" sx={{ color: "blue", marginTop: 0 }}>
              Users
            </Typography>

            <Button
              size="small"
              variant="contained"
              color="secondary"
              onClick={() => setOpenAddForm(true)}
              sx={{ ml: "auto", height: 30 }}
            >
              Add User
            </Button>
          </Box>

          <Box id="users" sx={{ paddingLeft: 5, paddingTop: 5 }}>
          <TableContainer component={Paper}>
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>User (Id)</StyledTableCell>
                    <StyledTableCell align="left">Name</StyledTableCell>
                    <StyledTableCell align="left">Email</StyledTableCell>
                    <StyledTableCell align="left">Contact Number</StyledTableCell>
                    <StyledTableCell align="left">Actions</StyledTableCell>
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
                          align="left"
                          component="th"
                          scope="row"
                        >
                          {row.name}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.email}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.contactNumber}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          <EditIcon
                            sx={{ cursor: "pointer" }}
                            onClick={() => handleOpenEditForm(row)}
                          />
                          <DeleteIcon
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
      <Snackbar
        open={openSuccessSnack}
        autoHideDuration={6000}
        onClose={() => setOpenSuccessSnack(false)}
      >
        <Alert
          onClose={() => setOpenSuccessSnack(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {successMsg}
        </Alert>
      </Snackbar>
      <Snackbar
        open={openErrorSnack}
        autoHideDuration={6000}
        onClose={() => setOpenErrorSnack(false)}
      >
        <Alert
          onClose={() => setOpenErrorSnack(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMsg}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Users;
