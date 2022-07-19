import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from "@mui/material";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import red from "@mui/material/colors/red";

import { useAuth } from "../Auth.js";

import AppBar from "../components/AppBar.js";
import Copyright from "../components/Copyright.js";
import { Box } from "@mui/system";

const theme = createTheme({
    palette : {
        secondary : red,
    },
});

function Profile() {
    const [username, setUsername] = useState("");
    const [busy, setBusy] = useState(true);
    const [open, setOpen] = useState(false);

    const auth = useAuth();
    let navigate = useNavigate();

    const handleClickOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleSubmit = () => {
        handleClose();
        var id = localStorage.getItem("userid");
        var url = "/api/users/" + id + "/delete";
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var raw = JSON.stringify({
            userid : id
        });
        var requestOptions = {
            method : "POST",
            headers : myHeaders,
            body : raw
        }
        fetch(url, requestOptions)
            .then(res => {
                // console.log(res);
                auth.logout()
                    .then(navigate("/"));
            })
            .catch(err => console.log(err));
    }

    useEffect(() => {
        var id = localStorage.getItem("userid");
        var url = "/api/users/" + id;
        fetch(url)
            .then(res => res.json())
            .then(data => {
                // console.log(data);
                setUsername(data.user.username);
                setBusy(false);
                // console.log("hook " + username);
            })
            .catch(err => console.log(err));
    }, []);

    return(
        <div className="profile">
            <AppBar />
            { !busy && (
                <Container sx={{marginTop : 3}}>
                    <ThemeProvider theme={theme}>
                        <Typography variant="h2" component="h1">
                            My Profile
                        </Typography>

                        <Box sx={{marginTop : 3}}>
                            <Typography variant="h5" component="p">
                                Username: {username}
                            </Typography>

                            <Button sx={{marginTop : 2}}
                                color="secondary"
                                variant="contained"
                                onClick={handleClickOpen}
                            >
                                Delete User
                            </Button>

                            <Dialog
                                open={open}
                                onClose={handleClose}
                                aria-labelledby="delete-dialog"
                                aria-describedby="delete-user"
                            >
                                <DialogTitle id="alert-dialog-title">
                                    {"Delete User?"}
                                </DialogTitle>
                                <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                        This action cannot be undone.
                                    </DialogContentText>
                                </DialogContent>

                                <DialogActions sx={{padding : 2}}>
                                    <Button onClick={handleClose}>Cancel</Button>
                                    <Button onClick={handleSubmit} color="secondary" autoFocus>Delete</Button>
                                </DialogActions>
                            </Dialog>

                        </Box>

                        <Copyright />
                    </ThemeProvider>
                </Container>
                )
            }
        </div>
    );
}

export default Profile;