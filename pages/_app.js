import React from 'react';
import App from 'next/app';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '../src/components/AppBar/AppBar.js';
import BottomNavigation from '../src/components/BottomNav/BottomNav.js';
import BottomNavContext from '../src/Context/BottomNavContext.js';
export default class MyApp extends App {
  constructor (props) {
    super(props)
    this.state = {
      bottomNavSetting: 0
    }
  }

  componentDidMount () {
    console.log('app mounted')
  }

  setBottomNavSetting = val => this.setState({ bottomNavSetting: val });

  render () {
    const { Component, pageProps } = this.props

    return (
      <BottomNavContext.Provider
        value={{
          bottomNavSetting: this.state.bottomNavSetting,
          setBottomNavSetting: this.setBottomNavSetting
        }}
      >
        <>
          <AppBar />
          {/* <ThemeProvider theme={theme}> */}
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <Component {...pageProps} />
          {/* </ThemeProvider> */}
          <BottomNavigation />
        </>
      </BottomNavContext.Provider>
    )
  }
}
