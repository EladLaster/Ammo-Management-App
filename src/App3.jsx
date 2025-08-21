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
          <FormPage/>
          <LoginPage/>
      </div>
  )
}

export default App;
