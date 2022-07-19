import React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import MenuAppBar from "../components/AppBar.js";
import Box from "@mui/material/Box";

import Copyright from "../components/Copyright";

function PageNotFound() {
    return(
        <div className="pagenotfound">
            <MenuAppBar />
            <Container>
                <Box sx={{marginTop : 3, height : 400}}>
                    <Typography variant="h2" component="h1">
                        Page Not Found
                    </Typography>

                    <Typography sx={ {marginTop : 2} } variant="h5" component="body">
                        The page you requested does not exist
                    </Typography>
                </Box>

                <Copyright />
            </Container>
        </div>
    );
}

export default PageNotFound;