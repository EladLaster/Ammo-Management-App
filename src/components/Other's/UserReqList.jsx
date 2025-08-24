import { useEffect, useState } from "react";
import { supabase } from "../../../data/supabase";
import UserInventory from "./UserInventory";

function translateStatus(status) {
  const statusMap = {
    pending: "ממתינה",
    approved: "אושרה",
    rejected: "נדחתה",
    completed: "הושלמה",
  };
  return statusMap[status] || status;
}

function UserReqList({ userId, unitId }) {
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
            "id, quantity, status, created_at, item_id, items(item_name, category)"
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
      <div className="modern-card p-xl">
        <div className="modern-loading">
          <div className="modern-spinner"></div>
          <span className="ml-md">טוען בקשות...</span>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="modern-card p-xl">
        <div className="text-center">
          <div className="modern-badge modern-badge-danger mb-md">
            שגיאה בטעינת הבקשות
          </div>
          <p>{error}</p>
        </div>
      </div>
    );

  if (!requests || requests.length === 0) {
    return (
      <div className="modern-card p-xl">
        <div className="text-center">
          <div className="modern-badge modern-badge-info mb-md">
            אין בקשות להצגה
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="modern-card mb-xl">
        <div className="p-xl">
          <div className="modern-nav mb-lg">
            <h2>הבקשות שלי</h2>
            <div className="modern-badge modern-badge-info">
              {requests.length} בקשות
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>פריט</th>
                  <th>כמות</th>
                  <th>סטטוס</th>
                  <th>תאריך</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req.id}>
                    <td>
                      <strong>{req.items?.item_name || req.item_id}</strong>
                    </td>
                    <td>
                      <span className="modern-badge modern-badge-info">
                        {req.quantity}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`modern-badge ${
                          req.status === "pending"
                            ? "modern-badge-warning"
                            : req.status === "approved"
                            ? "modern-badge-success"
                            : req.status === "rejected"
                            ? "modern-badge-danger"
                            : "modern-badge-info"
                        }`}
                      >
                        {translateStatus(req.status)}
                      </span>
                    </td>
                    <td>
                      {req.created_at
                        ? new Date(req.created_at).toLocaleDateString("he-IL")
                        : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <UserInventory unitId={unitId} />
    </>
  );
}

export default UserReqList;
