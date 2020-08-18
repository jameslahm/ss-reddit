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
import WritePost from "./components/WritePost";

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
          <Box mx="auto" maxWidth="3xl" width="100%" px={2} pb={12}>
            <Router>
              <Home path="/"></Home>
              <LogIn path="/login"></LogIn>
              <WritePost path="/write"></WritePost>
            </Router>
          </Box>
        </ColorModeProvider>
      </ThemeProvider>
    </AuthContext.Provider>
  );
}

export default App;
