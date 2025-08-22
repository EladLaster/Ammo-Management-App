import { useEffect, useState } from "react";
import { supabase } from "../../data/supabase";

function InventoryTable() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from("inventory_admins")
          .select(
            `unit_id, item_id, quantity, last_updated, items (item_name, category), units (name)`
          );
        if (error) throw error;
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
          <th style={{ border: "1px solid #ccc", padding: 8 }}>יחידה</th>
          <th style={{ border: "1px solid #ccc", padding: 8 }}>כמות</th>
          <th style={{ border: "1px solid #ccc", padding: 8 }}>מזהה פריט</th>
          <th style={{ border: "1px solid #ccc", padding: 8 }}>
            עודכן לאחרונה
          </th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.unit_id + "-" + item.item_id}>
            <td style={{ border: "1px solid #ccc", padding: 8 }}>
              {item.items?.item_name}
            </td>
            <td style={{ border: "1px solid #ccc", padding: 8 }}>
              {item.items?.category || ""}
            </td>
            <td style={{ border: "1px solid #ccc", padding: 8 }}>
              {item.units?.name || ""}
            </td>
            <td style={{ border: "1px solid #ccc", padding: 8 }}>
              {item.quantity}
            </td>
            <td style={{ border: "1px solid #ccc", padding: 8 }}>
              {item.item_id}
            </td>
            <td style={{ border: "1px solid #ccc", padding: 8 }}>
              {item.last_updated
                ? new Date(item.last_updated).toLocaleString()
                : ""}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default InventoryTable;
