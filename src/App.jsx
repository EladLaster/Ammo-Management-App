// src/App.jsx
import { HashRouter  as Router, Routes, Route } from "react-router-dom";
import { HomePageAdmin } from "./Pages/HomePageAdmin";
// import { RequestsPageAdmin } from "./Pages/RequestsPageAdmin";
import { LoginPage } from "./Pages/LoginPage";
import { HomePageUser } from "./Pages/HomePageUser";
import { FormPage } from "./Pages/FormPage";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<LoginPage />} />

        <Route path="/home-admin" element={<HomePageAdmin />} />
        {/* <Route path="/requests-admin" element={<RequestsPageAdmin />} /> */}

        <Route path="/home-user" element={<HomePageUser />} />

        <Route path="/form" element={<FormPage />} />
      </Routes>
    </Router>
  );
}

export default App;
