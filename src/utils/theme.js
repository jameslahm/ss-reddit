import { theme as defaultTheme } from "@chakra-ui/core";

const fontFamily = `Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"`;

const theme = {
  ...defaultTheme,
  fonts: {
    ...defaultTheme.fonts,
    heading: fontFamily,
    body: fontFamily,
  },
  icons: {
    ...defaultTheme.icons,
    // bookmark: {
    //   path: (
    //     <path d="M66.002,11.413H33.998c-5.696,0-10.331,4.635-10.331,10.332v57.74c0,1.654,0.654,3.173,1.842,4.278   c1.088,1.013,2.565,1.593,4.052,1.593c1.636,0,3.158-0.676,4.286-1.903L50.209,65.65l16.598,13.284   c1.057,0.846,2.317,1.293,3.646,1.293c3.242,0,5.881-2.634,5.881-5.871V21.745C76.333,16.048,71.698,11.413,66.002,11.413z    M72.333,74.356c0,1.171-0.956,1.871-1.881,1.871c-0.416,0-0.801-0.14-1.146-0.416L51.25,61.36   c-0.822-0.657-2.013-0.565-2.723,0.208L30.901,80.745c-0.464,0.504-0.984,0.61-1.341,0.61c-0.487,0-0.971-0.19-1.327-0.522   c-0.259-0.24-0.566-0.669-0.566-1.349v-57.74c0-3.491,2.84-6.332,6.331-6.332h32.004c3.491,0,6.331,2.84,6.331,6.332V74.356z" />
    //   ),
    //   viewBox: "0 0 100 125",
    // },
  },
};

export default theme;
