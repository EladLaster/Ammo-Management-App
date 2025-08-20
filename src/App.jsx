import { useState } from 'react'
import './App.css'
import { HomePageAdmin } from "./Laster/Pages/HomePageAdmin";
import { RequestsPageAdmin } from "./Laster/Pages/RequestsPageAdmin";

function App() {

return (
  <>
    <h2>Laster</h2>
    <HomePageAdmin />
    <RequestsPageAdmin />
  </>
);
}

export default App
