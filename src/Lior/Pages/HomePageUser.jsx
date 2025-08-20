import { inventoryMock } from "../../inventory";

function HomePageUser() {
  return (
    <div style={{ maxWidth: 500, margin: "40px auto", direction: "rtl" }}>
      <h2>רשימת פריטים במלאי</h2>
      <ul>
        {inventoryMock.map((item) => (
          <li key={item.item_id}>
            <b>{item.item_name}</b> - {item.category} | כמות: {item.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HomePageUser;
