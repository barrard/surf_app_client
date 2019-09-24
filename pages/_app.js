import React from "react";
import App from "next/app";
import Head from "next/head";
import { ThemeProvider } from "@material-ui/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import theme from "../src/theme";
import AppBar from "../src/components/AppBar/AppBar.js";
import BottomNavigation from "../src/components/BottomNav/BottomNav.js";
import BottomNavContext from "../src/Context/BottomNavContext.js";
export default class MyApp extends App {
  componentDidMount() {
    console.log("app mounted");
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
        <BottomNavContext.Provider value={0}>
      <React.Fragment>
          <AppBar />
          {/* <ThemeProvider theme={theme}> */}
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <Component {...pageProps} />
          {/* </ThemeProvider> */}
          <BottomNavigation />
      </React.Fragment>
        </BottomNavContext.Provider>
    );
  }
}
