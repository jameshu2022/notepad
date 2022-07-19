import * as React from 'react';
import { useState } from "react";
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import Copyright from "./Copyright.js";
import HomeLink from "./HomeLink.js";

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";

import { useAuth } from "../Auth.js";
import { useNavigate, useLocation } from "react-router-dom";
import jwt_decode from "jwt-decode";

const theme = createTheme();

const schema = yup.object({
  username : yup.string()
    .required("Username cannot be empty.")
    .test("alphanumeric", "Username contains non-alphanumeric characters",
      value => {
        var code, i, len;

        for (i = 0, len = value.length; i < len; i++) {
          code = value.charCodeAt(i);
          if (!(code > 47 && code < 58) && // numeric (0-9)
              !(code > 64 && code < 91) && // upper alpha (A-Z)
              !(code > 96 && code < 123) || // lower alpha (a-z)
              (code === 32 || code === 160)  ) { // space
            return false;
          }
        }
        return true;
      }),
  password : yup.string()
    .required("Password cannot be empty."),
}).required();

export default function UserForm(props) {
//   const handleSubmit = (event) => {
//     event.preventDefault();
//     const data = new FormData(event.currentTarget);
//     console.log({
//       username: data.get('username'),
//       password: data.get('password'),
//     });
//   };
  const auth = useAuth();
  let navigate = useNavigate();
  const { state } = useLocation();

  const onSubmit = (data) => {
    if(props.formType === "login") {
        var url = "/api/users/login";
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var raw = JSON.stringify({
            username : data.username,
            password : data.password
        });
        var requestOptions = {
            method : "POST",
            headers : myHeaders,
            body : raw
        }
        fetch(url, requestOptions)
            .then(res => {
                if(res.ok){
                    return res.json();
                } else if(res.status === 403){
                    setError("login", "Username or password was incorrect.");
                    throw new Error("Username or password was incorrect.");
                } else {
                    setError("misc", "Something went wrong. Please try again.");
                    throw new Error("Something went wrong.");
                }
            })
            .then(json_data => {
                // console.log(json_data);
                var decoded_token = jwt_decode(json_data.token);
                // console.log("decoded " + JSON.stringify(decoded_token));
                auth.login()
                    .then(() => {
                        localStorage.setItem("userid", decoded_token.id);
                        navigate(state?.path || "/");
                    });
            })
            .catch(err => console.log(err));
    } else if(props.formType === "signup"){
        var url = "/api/users/create";
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            username : data.username,
            password : data.password
        });

        var requestOptions = {
            method : "POST",
            headers : myHeaders,
            body : raw
        }

        fetch(url, requestOptions)
            .then(res => {
                // console.log("DONE");
                if(res.ok){
                    navigate("/login");
                } else if(res.status === 409){
                  setError("signup", "This username is already taken.");
                  throw new Error("This username is already taken.");
                }
            })
            .catch(err => console.log(err));
    }
  }

  const { 
    handleSubmit,
    control,
    setError,
    formState : {errors} } = useForm( {
      defaultValues : {username : "", password : ""},
      resolver : yupResolver(schema)
    } );

  const [showPassword, setShowPassword] = useState(false);
  const handleShowPasswordClick = () => {
    setShowPassword(!showPassword);
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
          <HomeLink />
          <Box
            sx={{
              // marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width : 1,
            }}
          >
            {/* <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar> */}
            <Typography component="h1" variant="h5">
              {props.title}
            </Typography>
            <Box sx={{mt : 1}} minWidth={1}>
              <form noValidate onSubmit={handleSubmit(onSubmit)}>
                {/* <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  autoFocus
                /> */}
                <Controller
                  name="username"
                  control={control}
                  // rules={
                  //   {
                  //     required : true
                  //   }
                  // }
                  render={ ({ field : {onChange, onBlur, value} }) => (
                    <TextField
                      margin="normal"
                      // required
                      fullWidth
                      id="username"
                      label="Username"
                      name="username"
                      autoComplete="current-username"
                      autoFocus
                      variant="outlined"
                      error={errors?.username != null ? true : false}

                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                    />
                  )}
                />
                {/* <Typography sx={{bgcolor : 'red'}} variant="inherit">This field is required.</Typography> */}
                


                {/* {errors?.username?.type == "required" && <Typography variant="body2" component="p">This field is required.</Typography>} */}
                {errors?.username && <Typography color="red" variant="p" component="p">{errors.username.message}</Typography>}


                {/* <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                /> */}

                
                <Controller 
                  name="password"
                  control={control}
                  // rules={
                  //   {
                  //     required : true
                  //   }
                  // }
                  render={ ({ field : {onChange, onBlur, value, ref}}) => (
                    <TextField
                      margin="normal"
                      // required
                      fullWidth
                      name="password"
                      label="Password"
                      type={showPassword ? "text" : "password"}
                      id="password"
                      autoComplete="current-password"
                      variant="outlined"
                      error={errors?.password != null ? true : false}

                      InputProps={{
                        endAdornment : (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleShowPasswordClick}
                              tabIndex={-1}
                            >
                              {showPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}

                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                    />  
                    
                  )}
                />
                {/* {errors?.password?.type == "required" && <Typography variant="body2" component="p">This field is required.</Typography>} */}
                {errors?.password && <Typography color="red" className="error-message" variant="p" component="p">{errors.password.message}</Typography>}
                {/* <Typography variant="inherit">This field is required.</Typography> */}


                {props.rememberMe}

                {errors?.login && <Typography color="red" className="error-message" variant="p" component="p">Your username or password was incorrect.</Typography>}
                {errors?.signup && <Typography color="red" className="error-message" variant="p" component="p">This username is already taken.</Typography>}
                {errors?.misc && <Typography color="red" className="error-message" variant="p" component="p">Something went wrong. Please try again.</Typography>}

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}

                  // onClick={handleSubmit(onSubmit)}
                >
                  {props.title}
                </Button>
              </form>
            </Box>
          </Box>

        {props.linkText}

        {/* <Copyright sx={{ mt: 8, mb: 4 }} /> */}
        <Copyright />
      </Container>
    </ThemeProvider>
  );
}

