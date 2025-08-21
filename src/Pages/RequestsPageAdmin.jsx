import { useNavigate } from "react-router-dom";
import { Inventory } from "../components/Inventory";
import "./RequestsPageAdmin.css";

export function RequestsPageAdmin() {

  const navigate = useNavigate();

  return (
    <div className="homepageAdmin">
      <div className="pageTitle">
        <h1>בקשות תחמושת</h1>
        <button onClick={()=>navigate("/home-admin")}>דף הבית</button>
      </div>
      <Inventory />
    </div>
  );
}