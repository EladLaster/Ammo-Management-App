import { useState } from 'react'

import './App.css'
import { FormPage } from './Guy/Pages/FormPage'
import { LoginPage } from './Guy/Pages/LoginPage'
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import "@mantine/core/styles.css"; 
import './App3.css'
function App() {

return(
  <>
    {/* <MantineProvider defaultColorScheme="dark" theme={{ primaryColor: "indigo", fontFamily: "Inter, system-ui, Avenir, Helvetica, Arial, sans-serif", defaultRadius: "md",}}>
          <Notifications position="top-right" /> */}
          <div className="container">
            <h2>Guy</h2>
            <div className="build">
            <FormPage/>
            <LoginPage/>
            </div>
          </div>
    {/* </MantineProvider> */}
  </>
  )
}

export default App
