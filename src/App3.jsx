import { useState } from 'react'

import './App.css'
import { FormPage } from './Guy/Pages/FormPage'
import { LoginPage } from './Guy/Pages/LoginPage'

function App() {

return(
  <>
  <h2>Guy</h2>
  <FormPage/>
  <LoginPage/>
  </>
  )
}

export default App
