import React, { useState } from "react";
import {
  CSSReset,
  Box,
  ThemeProvider,
  ColorModeProvider,
} from "@chakra-ui/core";
import Header from "./components/Header";
import Home from "./components/Home";
import LogIn from "./components/LogIn";
import { Router } from "@reach/router";
import "./App.css";
import { theme, AuthContext } from "./utils";
import { ReactQueryDevtools } from "react-query-devtools";
import EditPost from "./components/EditPost";
import PrivateRoute from "./components/PrivateRoute";
import Post from "./components/Post";
import Profile from "./components/Profile";
import Footer from "./components/Footer";

function App() {
  const [authState, setAuthState] = useState(
    JSON.parse(localStorage.getItem("auth"))
  );

  function setAuthStateAndSave(auth) {
    localStorage.setItem("auth", JSON.stringify(auth));
    setAuthState(auth);
  }

  return (
    <AuthContext.Provider value={{ authState, setAuthStateAndSave }}>
      <ThemeProvider theme={theme}>
        <ColorModeProvider>
          <CSSReset></CSSReset>
          <ReactQueryDevtools initialIsOpen={false}></ReactQueryDevtools>
          <Header></Header>
          <Box role="main" mx="auto" maxWidth="3xl" width="100%" px={4} pb={4}>
            <Router primary={false}>
              <PrivateRoute component={Home} path="/"></PrivateRoute>
              <LogIn path="/login"></LogIn>
              <PrivateRoute component={EditPost} path="/edit"></PrivateRoute>
              <PrivateRoute
                component={EditPost}
                path="/edit/:id"
              ></PrivateRoute>
              <PrivateRoute component={Post} path="/post/:id"></PrivateRoute>
              <PrivateRoute component={Profile} path="/user/:id"></PrivateRoute>
            </Router>
          </Box>
          <Footer></Footer>
        </ColorModeProvider>
      </ThemeProvider>
    </AuthContext.Provider>
  );
}

export default App;
