import { useNavigate } from "react-router-dom";
import { Status } from "../components/Status";
import "./HomePageAdmin.css";

export function HomePageAdmin() {

  const navigate = useNavigate();
  return (
    <div className="homepageAdmin">
      <div className="pageTitle">
        <h1>דף הבית</h1>
        <button onClick={()=>{navigate("/requests-admin")}}>בקשות</button>
      </div>
      <Status />
    </div>
  );
}