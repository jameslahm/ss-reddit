import { theme as defaultTheme } from "@chakra-ui/core";

const fontFamily = `Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"`;

const theme = {
  ...defaultTheme,
  fonts: {
    ...defaultTheme.fonts,
    heading: fontFamily,
    body: fontFamily,
  },
};

export default theme;
