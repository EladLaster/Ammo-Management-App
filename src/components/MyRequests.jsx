import { useEffect, useState } from "react";
import { supabase } from "../../data/supabase";

function MyRequests({ userId }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRequests() {
      setLoading(true);
      setError(null);
      try {
        if (!userId) {
          setRequests([]);
          setLoading(false);
          return;
        }
        const { data, error } = await supabase
          .from("requests")
          .select(
            `id, quantity, status, created_at, last_updated, items (item_name)`
          )
          .eq("user_id", userId);
        if (error) throw error;
        setRequests(data);
      } catch (e) {
        setError(e.message || e);
      } finally {
        setLoading(false);
      }
    }
    fetchRequests();
  }, [userId]);

  if (loading)
    return (
      <div style={{ padding: 24, textAlign: "center" }}>טוען בקשות...</div>
    );
  if (error)
    return (
      <div style={{ padding: 24, color: "red", textAlign: "center" }}>
        שגיאה: {error}
      </div>
    );
  if (!requests || requests.length === 0) {
    return (
      <div style={{ padding: 24, textAlign: "center" }}>אין בקשות להצגה</div>
    );
  }
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16 }}>
      <thead>
        <tr>
          <th>מזהה</th>
          <th>שם פריט</th>
          <th>כמות</th>
          <th>סטטוס</th>
          <th>תאריך</th>
        </tr>
      </thead>
      <tbody>
        {requests.map((req) => (
          <tr key={req.id}>
            <td>{req.id}</td>
            <td>{req.items?.item_name}</td>
            <td>{req.quantity}</td>
            <td>{req.status}</td>
            <td>
              {req.created_at
                ? new Date(req.created_at).toLocaleDateString()
                : ""}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default MyRequests;
