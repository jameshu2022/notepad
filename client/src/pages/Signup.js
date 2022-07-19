import { React } from "react";
import UserForm from "../components/UserForm.js";

import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Container from "@mui/material/Container";

import { Link as RouterLink } from "react-router-dom";

function SignupLinks() {
    return(
        <Grid container justifyContent="flex-end">
            <Grid item>
                <Link component={RouterLink} to="/login" variant="body2">
                    Have an Account? Log In
                </Link>
            </Grid>
        </Grid>
    );
}

function Signup() {

    // const onSubmit = (data) => {
    //     var url = "/api/users/create";
    //     var myHeaders = new Headers();
    //     myHeaders.append("Content-Type", "application/json");

    //     var raw = JSON.stringify({
    //         username : data.username,
    //         password : data.password
    //     });

    //     var requestOptions = {
    //         method : "POST",
    //         headers : myHeaders,
    //         body : raw
    //     }

    //     fetch(url, requestOptions)
    //         .then(res => {
    //             // console.log("DONE");
    //             if(res.ok){
    //                 navigate("/login");
    //             }
    //         })
    //         .catch(err => console.log(err));
    // }

    return(
        <Container>
            <UserForm title="Sign Up"
                linkText={<SignupLinks />}
                formType="signup"
                // onSubmit={onSubmit}
            />
        </Container>
    );
}

export default Signup;