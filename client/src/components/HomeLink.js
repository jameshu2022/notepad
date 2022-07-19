import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import HomeIcon from "@mui/icons-material/Home";
import Link from "@mui/material/Link";

import { Link as RouterLink } from "react-router-dom";

function HomeLink() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        marginTop: 4,
        marginBottom: 3,
      }}
    >
      <Link component={RouterLink} to="/">
        <Avatar sx={{ m: 1, width: 48, height: 48, bgcolor: "primary.main" }}>
          <HomeIcon sx={{ fontSize: 36, cursor: "pointer" }} />
        </Avatar>
      </Link>
    </Box>
  );
}

export default HomeLink;
