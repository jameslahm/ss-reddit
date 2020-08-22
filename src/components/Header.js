import React, { useContext } from "react";
import {
  css,
  Button as ChakraButton,
  IconButton,
  Link as ChakraLink,
  Flex,
  useColorMode,
} from "@chakra-ui/core";
import styled from "@emotion/styled";
import { Link as ReachLink } from "@reach/router";
import { AuthContext } from "../utils";

const Link = (props) => {
  return (
    <ChakraLink
      css={css`
        text-decoration: none;
        &:hover {
          text-decoration: none;
        }
        &:focus {
          text-decoration: none;
        }
      `}
      {...props}
    ></ChakraLink>
  );
};

const Button = React.forwardRef((props, ref) => {
  return (
    <ChakraButton
      ref={ref}
      fontSize="md"
      fontWeight="normal"
      {...props}
    ></ChakraButton>
  );
});

const StickyNav = styled(Flex)`
  backdrop-filter: saturate(180%) blur(20px);
  z-index: 10;
  top: 0;
`;

function Header() {
  const { authState, setAuthStateAndSave } = useContext(AuthContext);
  const { colorMode, toggleColorMode } = useColorMode();

  const headerBgColor = {
    light: "rgb(255,255,255,0.8)",
    dark: "rgba(26, 32, 44,0.8)",
  };

  return (
    <StickyNav
      justifyContent="space-between"
      as="header"
      maxWidth="3xl"
      width={"100%"}
      mx={"auto"}
      pt={8}
      px={4}
      mt={4}
      pb={4}
      position="sticky"
      bg={headerBgColor[colorMode]}
    >
      <IconButton
        icon={colorMode === "light" ? "moon" : "sun"}
        onClick={toggleColorMode}
      ></IconButton>
      <Flex justifyContent="flex-end">
        <Link as={ReachLink} to="/">
          <Button variant="ghost">Home</Button>
        </Link>
        <Link as={ReachLink} to="/edit">
          <Button variant="ghost">Post</Button>
        </Link>
        {authState ? (
          <>
            <Link as={ReachLink} to={`/user/${authState.userId}`}>
              <Button variant="ghost">Profile</Button>
            </Link>
            <Button
              variant="ghost"
              onClick={() => {
                setAuthStateAndSave(null);
              }}
            >
              LogOut
            </Button>
          </>
        ) : (
          <Link as={ReachLink} to="/login">
            <Button variant="ghost">LogIn</Button>
          </Link>
        )}
      </Flex>
    </StickyNav>
  );
}

export default Header;
