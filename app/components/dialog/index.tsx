import * as React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import { Slide, Stack } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

export const DialogTransition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  hasBackButton?: boolean;
  onClose: () => void;
}

export function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, hasBackButton, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2, bgcolor: "background.default" }} {...other}>
      <Stack direction="row">
      <IconButton
      edge="start"
            aria-label="close"
            onClick={onClose}
            sx={{
              mr: 1,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            {hasBackButton ? <KeyboardBackspaceIcon /> : <CloseIcon />}
          </IconButton>
        <div>{children}</div>
      </Stack>
    </DialogTitle>
  );
}
