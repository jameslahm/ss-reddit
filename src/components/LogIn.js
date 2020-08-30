import React, { useState, useContext } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
  useToast,
} from "@chakra-ui/core";
import { login } from "../utils";
import { useMutation } from "react-query";
import { AuthContext } from "../utils";
import { navigate, useLocation } from "@reach/router";
import { generateToast } from "../utils";

function LogIn() {
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ username: "", password: "" });
  const [mutate] = useMutation(login);
  const toast = useToast();
  const { setAuthStateAndSave } = useContext(AuthContext);

  async function handleSubmit(e) {
    e.preventDefault();
    errors.username = username ? "" : "UserName can't be empty";
    errors.password = password ? "" : "Password can't be empty";
    if (errors.username || errors.password) {
      setErrors({ ...errors });
      return;
    }
    try {
      const data = await mutate({ username, password }, { throwOnError: true });
      setAuthStateAndSave({ ...data, bookmarks: [] });
      toast(generateToast(null, "/login"));
      if (location.state && location.state.from) {
        navigate(location.state.from);
      } else {
        navigate("/");
      }
    } catch (err) {
      toast(generateToast(err, "/login"));
    }
  }

  return (
    <Box mt={20} maxWidth="lg" width="100%" mx="auto">
      <form onSubmit={handleSubmit}>
        <FormControl isInvalid={errors.username}>
          <FormLabel htmlFor="username">Username</FormLabel>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            id="username"
            placeholder="UserName"
            autoComplete="username"
          ></Input>
          <FormErrorMessage>{errors.username}</FormErrorMessage>
        </FormControl>
        <FormControl mt={3} isInvalid={errors.password}>
          <FormLabel htmlFor="password">Password</FormLabel>
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            id="password"
            placeholder="Password"
            autoComplete="current-password"
          ></Input>
          <FormErrorMessage>{errors.password}</FormErrorMessage>
        </FormControl>
        <Button type="submit" mt={3} variantColor="teal">
          Submit
        </Button>
      </form>
    </Box>
  );
}

export default LogIn;
