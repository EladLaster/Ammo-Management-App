import { useEffect, useState } from "react";
import { fetchInventory } from "../services/inventoryService";

function InventoryTable() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchInventory();
        setItems(data);
      } catch (e) {
        setError(e.message || e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading)
    return <div style={{ padding: 24, textAlign: "center" }}>טוען מלאי...</div>;
  if (error)
    return (
      <div style={{ padding: 24, color: "red", textAlign: "center" }}>
        שגיאה: {error}
      </div>
    );
  if (!items || items.length === 0) {
    return (
      <div style={{ padding: 24, textAlign: "center" }}>אין נתונים במלאי</div>
    );
  }
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16 }}>
      <thead>
        <tr>
          <th style={{ border: "1px solid #ccc", padding: 8 }}>שם פריט</th>
          <th style={{ border: "1px solid #ccc", padding: 8 }}>קטגוריה</th>
          <th style={{ border: "1px solid #ccc", padding: 8 }}>כמות</th>
          <th style={{ border: "1px solid #ccc", padding: 8 }}>מזהה פריט</th>
          <th style={{ border: "1px solid #ccc", padding: 8 }}>
            עודכן לאחרונה
          </th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id || item.item_id}>
            <td style={{ border: "1px solid #ccc", padding: 8 }}>
              {item.products?.name}
            </td>
            <td style={{ border: "1px solid #ccc", padding: 8 }}>
              {item.products?.product_categories?.name || ""}
            </td>
            <td style={{ border: "1px solid #ccc", padding: 8 }}>
              {item.quantity}
            </td>
            <td style={{ border: "1px solid #ccc", padding: 8 }}>
              {item.id || item.item_id}
            </td>
            <td style={{ border: "1px solid #ccc", padding: 8 }}>
              {item.updated_at
                ? new Date(item.updated_at).toLocaleString()
                : ""}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default InventoryTable;
