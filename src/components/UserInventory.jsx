import { useEffect, useState } from "react";
import { supabase } from "../../data/supabase";

function UserInventory({ unitId }) {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchInventory() {
      setLoading(true);
      setError(null);
      try {
        if (!unitId) {
          setInventory([]);
          setLoading(false);
          return;
        }
        const { data, error } = await supabase
          .from("inventory_users")
          .select("item_id, quantity, items(item_name, category)")
          .eq("unit_id", unitId);
        if (error) throw error;
        setInventory(data);
      } catch (e) {
        setError(e.message || e);
      } finally {
        setLoading(false);
      }
    }
    fetchInventory();
  }, [unitId]);

  if (loading)
    return (
      <div className="modern-card p-xl">
        <div className="modern-loading">
          <div className="modern-spinner"></div>
          <span className="ml-md">טוען מלאי...</span>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="modern-card p-xl">
        <div className="text-center">
          <div className="modern-badge modern-badge-danger mb-md">
            שגיאה בטעינת המלאי
          </div>
          <p>{error}</p>
        </div>
      </div>
    );

  if (!inventory || inventory.length === 0) {
    return null;
  }

  return (
    <div className="modern-card">
      <div className="p-xl">
        <div className="modern-nav mb-lg">
          <h2>המלאי של היחידה שלי</h2>
          <div className="modern-badge modern-badge-info">
            {inventory.length} פריטים
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="modern-table">
            <thead>
              <tr>
                <th>פריט</th>
                <th>קטגוריה</th>
                <th>כמות</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((inv) => (
                <tr key={inv.item_id}>
                  <td>
                    <strong>{inv.items?.item_name || inv.item_id}</strong>
                  </td>
                  <td>
                    <span className="modern-badge modern-badge-info">
                      {inv.items?.category || ""}
                    </span>
                  </td>
                  <td>
                    <span className="modern-badge modern-badge-success">
                      {inv.quantity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default UserInventory;
