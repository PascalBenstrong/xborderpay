import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";

import { signOut, useSession, getSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { Toolbar, Typography } from "@mui/material";

type Anchor = "top" | "left" | "bottom" | "right";

export default function TemporaryDrawer({ menuLinks, open, handleClose }: any) {
  const router = useRouter();
  const pathname = usePathname();
  async function logout() {
    const callbackUrl = "/login";
    const res = await signOut({
      redirect: false,
      callbackUrl,
    });

    if (res) {
      router.push("/login");
    }
  }

  const handleClick = (slug: string) => {
    if (slug.includes("Signout")) {
      logout();
      return;
    }
    if (pathname != slug) router.push(slug);
  };

  const list = () => (
    <Box
      sx={{
        width: 250,
        height: "100%",
      }}
      role="presentation"
      bgcolor="secondary.main"
      onClick={handleClose}
      onKeyDown={handleClose}
    >
      <Toolbar sx={{ paddingTop: 5, paddingBottom: 5 }}>
        <Typography
          variant="h6"
          component="div"
          sx={{ fontSize: 30, fontWeight: 800 }}
        >
          xBorderPay
        </Typography>
      </Toolbar>
      <List>
        {menuLinks.map((item: any, index: number) => (
          <ListItem key={index} disablePadding>
            <ListItemButton onClick={() => handleClick(item?.slug)}>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {["Signout"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={() => handleClick(text)}>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
          <Drawer
            anchor="left"
            open={open}
            onClose={handleClose}
            color="black"
          >
            {list()}
          </Drawer>
    </div>
  );
}
