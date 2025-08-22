// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HomePageAdmin } from "./Pages/HomePageAdmin";
import { RequestsPageAdmin } from "./Pages/RequestsPageAdmin";
import { LoginPage } from "./Pages/LoginPage";
import { HomePageUser } from "./Pages/HomePageUser";
import { FormPage } from "./Pages/FormPage";
import "./App.css"

function App() {
  return (
    <Router>
      <Routes>
        {/* דף כניסה */}
        <Route path="/" element={<div className="container"><LoginPage /></div>} />

        {/* דפים למשתמש אדמין */}
        <Route path="/home-admin" element={<HomePageAdmin />} />
        <Route path="/requests-admin" element={<RequestsPageAdmin />} />

        {/* דפים למשתמש רגיל */}
        <Route path="/home-user" element={<HomePageUser />} />

        {/* דף טופס */}
        <Route path="/form" element={<div className="container"><FormPage /></div>} />
      </Routes>
    </Router>
  );
}

export default App;