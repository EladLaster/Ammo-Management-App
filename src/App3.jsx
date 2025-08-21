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
      <div className="container">
        <div className="build">
          <FormPage/>
          <LoginPage/>
        </div>
      </div>
  )
}

export default App;
