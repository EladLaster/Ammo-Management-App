import { Inventory } from "../components/Inventory";
import "./RequestsPageAdmin.css";

export function RequestsPageAdmin() {
  return (
    <div className="homepageAdmin">
      <div className="pageTitle">
        <h1>בקשות תחמושת</h1>
      </div>
      <Inventory />
    </div>
  );
}