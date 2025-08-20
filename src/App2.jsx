import { useState } from "react";

import "./App.css";
import { HomePageUser } from "./Lior/Pages/HomePageUser";
import { RequestsPageUser } from "./Lior/Pages/RequestsPageUser";

function App() {
  return (
    <>
      <h2>Lior</h2>
      <HomePageUser />
      <RequestsPageUser/>
    </>
  );
}

export default App;
