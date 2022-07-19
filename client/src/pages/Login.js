import { React } from "react";

import UserForm from "../components/UserForm.js";

import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Container from "@mui/material/Container";

// import { useAuth } from "../Auth.js";

// import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";


function LoginLinks() {
    return(
        <div>
            <Grid container>
                <Grid item xs>
                    <Link component={RouterLink} to="/forgotpassword" variant="body2">
                        Forgot Password?
                    </Link>
                </Grid>

                <Grid item>
                    <Link component={RouterLink} to="/signup" variant="body2">
                        No Account? Sign Up
                    </Link>
                </Grid>
            </Grid>
        </div>
    );
}

// function RememberMe() {
//     return(
//         <FormControlLabel
//             control={<Checkbox value="remember" color="primary" />}
//             label="Remember me"
//         />
//     );
// }

function Login() {
    // let navigate = useNavigate();
    // const auth = useAuth();
    // const { state } = useLocation();

    // const onSubmit = (data) => {
    //     var url = "/api/users/login";
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
    //             if(res.ok){
    //                 return res.json();
    //             } else if(res.status === 403){
    //                 throw new Error("Username or password was incorrect.");
    //             } else {
    //                 throw new Error("Something went wrong.");
    //             }
    //         })
    //         .then(json_data => {
    //             // console.log(json_data);
    //             var decoded_token = jwt_decode(json_data.token);
    //             // console.log("decoded " + JSON.stringify(decoded_token));
    //             auth.login()
    //                 .then(() => {
    //                     localStorage.setItem("userid", decoded_token.id);
    //                     navigate(state?.path || "/");
    //                 });
    //         })
    //         .catch(err => console.log(err));
    // }

    return(
        <Container>
            <UserForm title="Log In" 
                linkText={<LoginLinks />}
                // rememberMe={<RememberMe />}
                formType="login"
                // onSubmit={onSubmit}
            />
        </Container>
    );
}

export default Login;