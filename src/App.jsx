import { useState } from 'react'
import './App.css'
import { HomePageAdmin } from "./Pages/HomePageAdmin";
import { RequestsPageAdmin } from "./Pages/RequestsPageAdmin";
import { LoginPage } from "./Pages/LoginPage";
import HomePageUser from "./Pages/HomePageUser";
import { FormPage } from "./Pages/FormPage";
// import "./App3.css";


function App() {
  return (
    <>
      <h2>Laster</h2>
      <div className="container">
        <LoginPage />
      </div>
      <HomePageAdmin />
      <RequestsPageAdmin />
      <HomePageUser />
      {/* <RequestsPageUser /> */}
      <div className="container">
        <FormPage />
      </div>
    </>
  );
}

export default App
