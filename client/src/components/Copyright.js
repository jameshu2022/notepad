import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import "./Copyright.css";

function Copyright(props) {
  return (
    <Box sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}>
      {/* <BottomNavigation
          showLabels
        > */}
      <Box sx={{ paddingBottom: 3 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          {...props}
        >
          {/* {"Copyright © "} */}
          {"Source on "}
          {/* <Link component={RouterLink} color="inherit" to="https://github.com/jameshu15869/" target="_blank">
            Your Website
          </Link>{" "} */}
          <a className="github-link" target="_blank" href="https://github.com/jameshu15869">GitHub</a>{" "}
          {new Date().getFullYear()}
          {"."}
        </Typography>
      </Box>
      {/* </BottomNavigation> */}
    </Box>
  );
}

export default Copyright;
