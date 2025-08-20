import { inventoryMock } from "../../inventory";
import ItemList from "../components/ItemList";

function HomePageUser() {
  return (
    <div style={{ maxWidth: 500, margin: "40px auto", direction: "rtl" }}>
      <h2>רשימת פריטים במלאי</h2>
      <ItemList items={inventoryMock} />
    </div>
  );
}

export default HomePageUser;
