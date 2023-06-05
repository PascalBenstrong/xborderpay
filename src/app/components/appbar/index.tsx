import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Container,
  Tabs,
  Tab,
} from "@mui/material";
import React from "react";
import { styled, alpha } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";

function AppBarTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ mx: 2 }}>
      <Tabs value={value} onChange={handleChange}>
        <Tab label="Instant Transfer" sx={{fontWeight: value == 0 ? 700 : "normal"}}/>
        <Tab label="Transactions" sx={{fontWeight: value == 1 ? 700 : "normal"}}/>
      </Tabs>
    </Box>
  );
}

export default function XBPAppBar({ isProduct }: any) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" color="secondary">
        <Container maxWidth="xl">
          
            <Toolbar>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                variant="h6"
                component="div"
                sx={{ flexGrow: 1, fontSize: 30, fontWeight: 800 }}
              >
                xBorderPay
              </Typography>
              <AppBarTabs/>
              {/* <Button variant="outlined" color="inherit">
                Logout
              </Button> */}
            </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
}
