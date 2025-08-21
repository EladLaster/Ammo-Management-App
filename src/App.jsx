// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HomePageAdmin } from "./Pages/HomePageAdmin";
import { RequestsPageAdmin } from "./Pages/RequestsPageAdmin";
import { LoginPage } from "./Pages/LoginPage";
import HomePageUser from "./Pages/HomePageUser";
import { FormPage } from "./Pages/FormPage";

function App() {
  return (

    
      <Routes>
        {/* דף כניסה */}
        <Route path="/" element={<LoginPage />} />

        {/* דפים למשתמש אדמין */}
        <Route path="/home-admin" element={<HomePageAdmin />} />
        <Route path="/requests-admin" element={<RequestsPageAdmin />} />

        {/* דפים למשתמש רגיל */}
        <Route path="/home-user" element={<HomePageUser />} />

        {/* דף טופס */}
        <Route path="/form" element={<FormPage />} />
      </Routes>
  );
}

export default App;