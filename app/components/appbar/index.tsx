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
import Link from "next/Link";
import { usePathname } from "next/navigation";
import TemporaryDrawer from "./drawer";

const getValue = (pathname: string) => {
  if (pathname === "/e-transfer") return 1;
  else if (pathname === "/transactions") return 2;
  else {
    return 0;
  }
};
const MenuLinks = [
  {
    label: "Home",
    slug: "/",
  },
  {
    label: "Instant Transfer",
    slug: "/e-transfer",
  },
  {
    label: "Transactions",
    slug: "/transactions",
  },
];
function AppBarTabs() {
  const pathname = usePathname();
  const [value, setValue] = React.useState(getValue(pathname));

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ mx: 2, display: { xs: "none", md: "flex" } }}>
      <Tabs value={value} onChange={handleChange}>
        {MenuLinks.map((item, index) => (
          <Tab
            key={index}
            LinkComponent={Link}
            href={item.slug}
            label={item.label}
            sx={{ fontWeight: value == 0 ? 700 : "normal" }}
          />
        ))}
      </Tabs>
    </Box>
  );
}

export default function XBPAppBar() {
  const [open, setOpen] = React.useState(false);
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
              onClick={() => setOpen(true)}
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
            <AppBarTabs />
            {/* <Button variant="outlined" color="inherit">
                Logout
              </Button> */}
          </Toolbar>
        </Container>
        <TemporaryDrawer
          menuLinks={MenuLinks}
          open={open}
          handleClose={() => setOpen(false)}
        />
      </AppBar>
    </Box>
  );
}
