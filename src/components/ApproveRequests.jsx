import { useEffect, useState } from "react";
import { supabase } from "../../data/supabase";

function translateStatus(status) {
  const statusMap = {
    pending: "ממתינה",
    approved: "אושרה",
    rejected: "נדחתה",
    completed: "הושלמה",
  };
  return statusMap[status] || status;
}

export default function ApproveRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    fetchPending();
  }, []);

  async function fetchPending() {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("requests")
        .select(
          "id, user_id, quantity, status, created_at, item_id, unit_id, users:user_id(name), items(item_name, category)"
        )
        .eq("status", "pending");
      if (error) throw error;
      setRequests(data);
    } catch (e) {
      setError(e.message || e);
    } finally {
      setLoading(false);
    }
  }

  async function handleAction(id, newStatus) {
    setActionLoading((prev) => ({ ...prev, [id]: true }));
    try {
      const req = requests.find((r) => r.id === id);

      if (newStatus === "approved" && req) {
        console.log("[ApproveRequests] Approving request:", req);
        if (!req.unit_id || !req.item_id || !req.quantity) {
          alert(
            "שגיאה: נתונים חסרים או לא תקינים בבקשה (unit_id, item_id, quantity)"
          );
          return;
        }
        const { data: adminInv, error: adminInvError } = await supabase
          .from("inventory_admins")
          .select("quantity")
          .eq("unit_id", req.unit_id)
          .eq("item_id", req.item_id)
          .maybeSingle();
        if (adminInvError) {
          console.error("[ApproveRequests] adminInvError", adminInvError);
          throw adminInvError;
        }
        if (!adminInv || adminInv.quantity < req.quantity) {
          alert("אין מספיק מלאי לאישור הבקשה (inventory_admins)");
          return;
        }
        const { error: reqError } = await supabase
          .from("requests")
          .update({ status: newStatus, last_updated: new Date().toISOString() })
          .eq("id", id);
        if (reqError) throw reqError;
        const { data: invRows, error: invError } = await supabase
          .from("inventory_users")
          .select("quantity")
          .eq("unit_id", req.unit_id)
          .eq("item_id", req.item_id)
          .maybeSingle();
        if (invError) {
          console.error("[ApproveRequests] invError", invError);
          throw invError;
        }
        if (invRows) {
          const { error: updateError } = await supabase
            .from("inventory_users")
            .update({
              quantity: invRows.quantity + req.quantity,
              last_updated: new Date().toISOString(),
            })
            .eq("unit_id", req.unit_id)
            .eq("item_id", req.item_id);
          if (updateError) {
            console.error("[ApproveRequests] updateError", updateError);
            throw updateError;
          }
        } else {
          console.log("Requset: ");
          console.log(req);
          const { error: insertError } = await supabase
            .from("inventory_users")
            .insert({
              user_id: req.user_id,
              unit_id: req.unit_id,
              item_id: req.item_id,
              quantity: req.quantity,
              last_updated: new Date().toISOString(),
            });
          if (insertError) {
            console.error("[ApproveRequests] insertError", insertError);
            throw insertError;
          }
        }
        const { error: adminUpdateError } = await supabase
          .from("inventory_admins")
          .update({
            quantity: adminInv.quantity - req.quantity,
            last_updated: new Date().toISOString(),
          })
          .eq("unit_id", req.unit_id)
          .eq("item_id", req.item_id);
        if (adminUpdateError) {
          console.error("[ApproveRequests] adminUpdateError", adminUpdateError);
          throw adminUpdateError;
        }
      } else {
        const { error: reqError } = await supabase
          .from("requests")
          .update({ status: newStatus, last_updated: new Date().toISOString() })
          .eq("id", id);
        if (reqError) throw reqError;
      }
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch (e) {
      alert("שגיאה: " + (e.message || e));
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }));
    }
  }

  if (loading)
    return (
      <div className="modern-card p-xl">
        <div className="modern-loading">
          <div className="modern-spinner"></div>
          <span className="ml-md">טוען בקשות ממתינות...</span>
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
            אין בקשות ממתינות לאישור
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modern-card">
      <div className="p-xl">
        <div className="modern-nav mb-lg">
          <h2>בקשות ממתינות לאישור</h2>
          <div className="modern-badge modern-badge-warning">
            {requests.length} בקשות ממתינות
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="modern-table">
            <thead>
              <tr>
                <th>משתמש</th>
                <th>פריט</th>
                <th>כמות</th>
                <th>סטטוס</th>
                <th>תאריך</th>
                <th>פעולות</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id}>
                  <td>
                    <strong>{req.users?.name || req.user_id}</strong>
                  </td>
                  <td>
                    <strong>{req.items?.item_name || req.item_id}</strong>
                  </td>
                  <td>
                    <span className="modern-badge modern-badge-info">
                      {req.quantity}
                    </span>
                  </td>
                  <td>
                    <span className="modern-badge modern-badge-warning">
                      {translateStatus(req.status)}
                    </span>
                  </td>
                  <td>
                    {req.created_at
                      ? new Date(req.created_at).toLocaleDateString("he-IL")
                      : ""}
                  </td>
                  <td>
                    <div className="flex gap-sm">
                      <button
                        className="modern-btn modern-btn-success"
                        style={{
                          fontSize: "0.75rem",
                          padding: "var(--space-xs) var(--space-sm)",
                        }}
                        disabled={actionLoading[req.id]}
                        onClick={() => handleAction(req.id, "approved")}
                      >
                        {actionLoading[req.id] ? "⏳" : "✅"} אשר
                      </button>
                      <button
                        className="modern-btn modern-btn-danger"
                        style={{
                          fontSize: "0.75rem",
                          padding: "var(--space-xs) var(--space-sm)",
                        }}
                        disabled={actionLoading[req.id]}
                        onClick={() => handleAction(req.id, "rejected")}
                      >
                        {actionLoading[req.id] ? "⏳" : "❌"} דחה
                      </button>
                    </div>
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
