import { extendTheme, type ThemeConfig } from "@chakra-ui/react";
import "@fontsource/space-grotesk";
import "@fontsource/roboto";
import "@fontsource/raleway";

const config: ThemeConfig = {
    initialColorMode: "light",
    useSystemColorMode: false,
};

const theme = extendTheme({
    fonts: {
        space: `'Space Grotesk', sans-serif`,
        roboto: `'Roboto', sans-serif`,
        raleway: `'Raleway', sans-serif`,
    },
    config,
});

export default theme;
