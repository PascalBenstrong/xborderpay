"use client";
import { signIn,  } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import {
  FormControl,
  Unstable_Grid2 as Grid,
  InputLabel,
  Typography,
  Button,
  Box,
} from "@mui/material";
//import BootstrapInput from "../../../components/BootstrapInput";
import Link from "next/link";
import BootstrapInput from "@/components/entry/bootstrapInput";
import useLocalStorage from "@/utils/useStorage";

export const LoginForm = () => {
  const router = useRouter();
  const [pkValue, setPkValue] = useLocalStorage("shouldRequestKey", "");
  const [userAccount, setUserAccount] = useLocalStorage("account", "");
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      const res = await signIn("credentials", {
        authType: "register",
        redirect: false,
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        email: formValues.email,
        password: formValues.password,
        callbackUrl,
      });

      //setLoading(false);

      if (!res?.error) {

        //store userInfo
        const _user = {
          email: formValues.email
        }
        setUserAccount(JSON.stringify(_user))

        router.push(callbackUrl);
        setFormValues({ firstName: "", lastName: "", email: "", password: "" });
        setLoading(false);
      } else {
        setError(res?.error ? res?.error : "invalid email or password");
        setLoading(false);
      }
    } catch (error: any) {
      setLoading(false);
      setError(error);
      //console.log("error: ", error);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  return (
    <Box component="form" onSubmit={onSubmit} sx={{ mt: 4 }}>
      {error && (
        <Typography align="center" color="red" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      <FormControl variant="standard" fullWidth sx={{ mt: 1, mb: 3 }}>
        <InputLabel shrink sx={{ color: "lightGrey" }} htmlFor="firstName">
          First Name*
        </InputLabel>
        <BootstrapInput
          placeholder="Please enter your first Name"
          id="firstName"
          name="firstName"
          type="text"
          autoComplete="firstName"
          value={formValues.firstName}
          onChange={handleChange}
          sx={{ color: "black",
          "& .MuiInputBase-input": {
            backgroundColor: "white",
          },}}
          autoFocus
          required
        />
      </FormControl>
      <FormControl variant="standard" fullWidth sx={{ mt: 1, mb: 3 }}>
        <InputLabel shrink sx={{ color: "lightGrey" }} htmlFor="lastName">
          Last Name*
        </InputLabel>
        <BootstrapInput
          placeholder="Please enter your last name"
          id="lastName"
          name="lastName"
          type="text"
          autoComplete="lastName"
          value={formValues.lastName}
          onChange={handleChange}
          sx={{ color: "black",
          "& .MuiInputBase-input": {
            backgroundColor: "white",
          },}}
          autoFocus
          required
        />
      </FormControl>
      <FormControl variant="standard" fullWidth sx={{ mt: 1, mb: 3 }}>
        <InputLabel shrink sx={{ color: "lightGrey" }} htmlFor="email">
          Email Address*
        </InputLabel>
        <BootstrapInput
          placeholder="Please enter your email address"
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={formValues.email}
          onChange={handleChange}
          sx={{ color: "black",
          "& .MuiInputBase-input": {
            backgroundColor: "white",
          },}}
          autoFocus
          required
        />
      </FormControl>
      <FormControl variant="standard" fullWidth sx={{ mt: 1, mb: 3 }}>
        <InputLabel shrink sx={{ color: "lightGrey" }} htmlFor="password">
          Password*
        </InputLabel>
        <BootstrapInput
          placeholder="Please enter your password"
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={formValues.password}
          sx={{ color: "black",
          "& .MuiInputBase-input": {
            backgroundColor: "white",
          },}}
          onChange={handleChange}
          required
        />
      </FormControl>
      <Grid container>
        <Grid xs>
           <Link href="/login">Login</Link>
        </Grid>
        <Grid>
          <Button
            color="primary"
            type="submit"
            size="large"
            fullWidth
            variant="contained"
            disabled={loading}
          >
            {loading ? "loading..." : "Sign Up"}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};
