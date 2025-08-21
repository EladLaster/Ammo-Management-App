import { Status } from "../components/Status";
import "./HomePageAdmin.css";

export function HomePageAdmin() {
  return (
    <div className="homepageAdmin">
      <div className="pageTitle">
        <h1>דף הבית</h1>
      </div>
      <Status />
    </div>
  );
}