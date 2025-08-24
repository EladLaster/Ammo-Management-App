import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { requestStore } from "../components/RequestStore";
import { authProvider } from "../../AuthProvider/AuthProvider";
import { useEffect, useState } from "react";

export const RequestsPageAdmin = observer(() => {
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const activeUser = authProvider.getActiveUser();
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserRequests = async () => {
      if (activeUser?.unit_id) {
        setIsLoading(true);
        try {
          await requestStore.loadRequestsByUnit(activeUser.unit_id);
        } catch (error) {
          console.error("Error loading unit requests:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadUserRequests();
  }, [activeUser?.unit_id]);

  const filtered = requestStore.requests.filter(
    (r) =>
      r.requester.includes(search) ||
      r.ammoType.includes(search) ||
      r.unitNumber.includes(search)
  );

  const getStatusBadge = (status) => {
    const statusClasses = {
      ממתינה: "modern-badge-warning",
      אושרה: "modern-badge-success",
      נדחתה: "modern-badge-danger",
    };

    const statusIcons = {
      ממתינה: "⏳",
      אושרה: "✅",
      נדחתה: "❌",
    };

    return (
      <span className={`modern-badge ${statusClasses[status]}`}>
        <span>{statusIcons[status]}</span>
        {status}
      </span>
    );
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "גבוהה":
        return "modern-badge-danger";
      case "בינונית":
        return "modern-badge-warning";
      case "נמוכה":
        return "modern-badge-success";
      default:
        return "modern-badge-info";
    }
  };

  if (!activeUser) {
    return (
      <div className="modern-container">
        <div className="modern-card p-xl">
          <div className="text-center">
            <div className="modern-badge modern-badge-danger mb-md">
              שגיאה: משתמש לא מחובר
            </div>
            <p>אנא התחבר למערכת כדי לצפות בבקשות</p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading || requestStore.isRequestsLoading) {
    return (
      <div className="modern-container">
        <div className="modern-card p-xl">
          <div className="modern-loading">
            <div className="modern-spinner"></div>
            <span className="ml-md">טוען בקשות...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modern-container">
      {/* Header */}
      <div className="modern-header">
        <div className="modern-nav">
          <div>
            <h1>בקשות תחמושת</h1>
            <p>
              ניהול בקשות ליחידה:{" "}
              {activeUser.unit_id
                ? `יחידה ${activeUser.unit_id}`
                : "לא זוהתה יחידה"}
            </p>
          </div>
          <div className="modern-nav-actions">
            <button
              className="modern-btn modern-btn-secondary"
              onClick={() => navigate("/home-admin")}
            >
              🏠 דף הבית
            </button>
          </div>
        </div>
      </div>

      {/* Search and Stats */}
      <div className="modern-card mb-xl">
        <div className="p-xl">
          <div className="modern-nav mb-lg">
            <h2>חיפוש וסטטיסטיקות</h2>
            <input
              type="text"
              placeholder="חיפוש לפי בקשה, סוג תחמושת או מבקש..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="modern-input"
              style={{ maxWidth: "400px" }}
            />
          </div>

          {requestStore.error && (
            <div className="modern-badge modern-badge-danger mb-lg">
              {requestStore.error}
              <button
                className="modern-btn modern-btn-secondary ml-sm"
                onClick={() => requestStore.clearError()}
              >
                סגור
              </button>
            </div>
          )}

          <div className="modern-grid modern-grid-4">
            <div className="modern-stats-card">
              <span
                className="modern-stats-number"
                style={{ color: "var(--military-green)" }}
              >
                {filtered.length}
              </span>
              <div className="modern-stats-label">סה"כ בקשות</div>
            </div>
            <div className="modern-stats-card">
              <span
                className="modern-stats-number"
                style={{ color: "var(--warning-600)" }}
              >
                {filtered.filter((r) => r.originalStatus === "pending").length}
              </span>
              <div className="modern-stats-label">ממתינות</div>
            </div>
            <div className="modern-stats-card">
              <span
                className="modern-stats-number"
                style={{ color: "var(--success-600)" }}
              >
                {filtered.filter((r) => r.originalStatus === "approved").length}
              </span>
              <div className="modern-stats-label">אושרו</div>
            </div>
            <div className="modern-stats-card">
              <span
                className="modern-stats-number"
                style={{ color: "var(--military-green)" }}
              >
                {
                  filtered.filter((r) => r.originalStatus === "completed")
                    .length
                }
              </span>
              <div className="modern-stats-label">הושלמו</div>
            </div>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="modern-card">
        <div className="p-xl">
          {filtered.length === 0 ? (
            <div className="text-center p-xl">
              <div className="modern-badge modern-badge-info mb-md">
                אין בקשות להציג
              </div>
              <p>לא נמצאו בקשות עבור היחידה שלך או החיפוש שלך</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>תאריך בקשה</th>
                    <th>מספר יחידה</th>
                    <th>סטטוס בקשה</th>
                    <th>כמות מבוקשת</th>
                    <th>סוג תחמושת</th>
                    <th>עדיפות בקשה</th>
                    <th>מבקש</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, idx) => (
                    <tr key={idx}>
                      <td>{r.requestDate}</td>
                      <td>
                        <span className="modern-badge modern-badge-info">
                          {r.unitNumber}
                        </span>
                      </td>
                      <td>{getStatusBadge(r.status)}</td>
                      <td>
                        <span className="modern-badge modern-badge-info">
                          {r.quantity}
                        </span>
                      </td>
                      <td>
                        <strong>{r.ammoType}</strong>
                      </td>
                      <td>
                        <span
                          className={`modern-badge ${getPriorityClass(
                            r.priority
                          )}`}
                        >
                          {r.priority === "גבוהה" && "🔴"}
                          {r.priority === "בינונית" && "🟡"}
                          {r.priority === "נמוכה" && "🟢"}
                          {r.priority}
                        </span>
                      </td>
                      <td>
                        <strong>{r.requester}</strong>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
