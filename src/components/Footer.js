import React from "react";
import { Text, Box } from "@chakra-ui/core";

function Footer() {
  return (
    <Box width="100%" mb={3} bottom={1} mt={4} textAlign="center">
      <Text color="gray.500" fontSize="xs">
        Copyright &copy; 2020 ss-reddit
      </Text>
    </Box>
  );
}

export default Footer;
