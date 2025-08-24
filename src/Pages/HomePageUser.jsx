import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { requestStore } from "../components/RequestStore";
import { authProvider } from "../../AuthProvider/AuthProvider";
import UserReqList from "../components/UserReqList";
import UnitWeatherContainer from "../components/API's/UnitWeatherContainer";

export const HomePageUser = observer(() => {
  const s = requestStore.status;
  const inventoryItems = requestStore.getInventoryItems();
  const isLoading = requestStore.isLoading;
  const error = requestStore.error;
  const navigate = useNavigate();

  // טען נתוני מלאי אוטומטית בטעינת הדף
  useEffect(() => {
    requestStore.refreshData();
    // eslint-disable-next-line
  }, []);

  const getStatusBadge = (item) => {
    const statusConfig = {
      "מלאי תקין": { class: "modern-badge-success", icon: "🛡️" },
      "מלאי נמוך": { class: "modern-badge-warning", icon: "⚡" },
      "מלאי קריטי": { class: "modern-badge-danger", icon: "❌" },
    };

    const config = statusConfig[item.status] || statusConfig["מלאי תקין"];

    return (
      <span className={`modern-badge ${config.class}`}>
        {item.statusIcon} {item.status}
      </span>
    );
  };

  const handleRefresh = () => {
    requestStore.refreshData();
  };

  if (!authProvider.activeUser) {
    navigate("/");
    return null;
  }

  if (error) {
    return (
      <div className="modern-container">
        <div className="modern-card p-xl">
          <div className="text-center">
            <div className="modern-badge modern-badge-danger mb-md">
              שגיאה בטעינת הנתונים
            </div>
            <p className="mb-lg">{error}</p>
            <button
              onClick={handleRefresh}
              className="modern-btn modern-btn-primary"
            >
              נסה שוב
            </button>
          </div>
        </div>
      </div>
    );
  }

  const userId = authProvider.activeUser?.id;
  // חישוב בקשות ממתינות של המשתמש הנוכחי בלבד
  const userPendingRequests = requestStore.requests.filter(
    (r) =>
      r.originalStatus === "pending" &&
      r.requester === authProvider.activeUser.name
  ).length;

  // Wiki description state
  const [wikiDesc, setWikiDesc] = useState("");
  const [wikiLoading, setWikiLoading] = useState(false);
  const [wikiError, setWikiError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");

  // Fetch description from Wikipedia API
  async function fetchWikiDescription(itemName) {
    setWikiLoading(true);
    setWikiError("");
    setWikiDesc("");
    setModalTitle(itemName);
    setModalOpen(true);
    console.log("Wiki API value:", itemName);
    try {
      const res = await fetch(
        `https://he.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
          itemName
        )}`
      );
      if (!res.ok) throw new Error("לא נמצא מידע בוויקיפדיה");
      const data = await res.json();
      setWikiDesc(data.extract || "לא נמצא מידע");
    } catch (e) {
      setWikiError(e.message || "שגיאה בשליפת מידע");
    } finally {
      setWikiLoading(false);
    }
  }

  return (
    <div className="modern-container">
      {/* Weather Widget */}
      <div className="mb-xl">
        <UnitWeatherContainer />
      </div>

      {/* Header */}
      <div className="modern-header">
        <div className="modern-nav">
          <div>
            <h1>דף הבית - משתמש</h1>
            <p>ברוך הבא, {authProvider.activeUser.name}</p>
          </div>
          <div className="modern-nav-actions">
            <button
              className="modern-btn modern-btn-primary"
              onClick={() => navigate("/form")}
            >
              ➕ בקשה חדשה
            </button>
            <button
              className="modern-btn modern-btn-danger"
              onClick={async () => {
                await authProvider.handleLogout();
                navigate("/");
              }}
            >
              🚪 התנתק
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="modern-grid modern-grid-4 mb-xl">
        <div className="modern-stats-card">
          <span
            className="modern-stats-number"
            style={{ color: "var(--military-green)" }}
          >
            {s.ammoTypes}
          </span>
          <div className="modern-stats-label">סוגי תחמושות</div>
        </div>
        <div className="modern-stats-card">
          <span
            className="modern-stats-number"
            style={{ color: "var(--success-600)" }}
          >
            {s.unitsInStock.toLocaleString()}
          </span>
          <div className="modern-stats-label">יחידות במלאי</div>
        </div>
        <div className="modern-stats-card">
          <span
            className="modern-stats-number"
            style={{ color: "var(--warning-600)" }}
          >
            {s.lowStockItems}
          </span>
          <div className="modern-stats-label">פריטים במלאי נמוך</div>
        </div>
        <div className="modern-stats-card">
          <span
            className="modern-stats-number"
            style={{ color: "var(--danger-600)" }}
          >
            {userPendingRequests}
          </span>
          <div className="modern-stats-label">בקשות ממתינות</div>
        </div>
      </div>

      {/* Inventory Report */}
      <div className="modern-card mb-xl">
        <div className="p-xl">
          <div className="modern-nav mb-lg">
            <h2>דו"ח מלאי</h2>
            <button
              onClick={handleRefresh}
              className="modern-btn modern-btn-secondary"
              disabled={isLoading}
            >
              {isLoading ? "⏳" : "🔄"} רענן
            </button>
          </div>

          {inventoryItems.length === 0 && !isLoading ? (
            <div className="text-center p-xl">
              <div className="modern-badge modern-badge-info mb-md">
                אין נתונים להצגה
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>תאריך עדכון</th>
                    <th>קוד פריט</th>
                    <th>שם פריט</th>
                    <th>סטטוס מלאי</th>
                    <th>כמות זמינה</th>
                    <th>סה"כ מלאי</th>
                    <th>פרטים נוספים</th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryItems.map((item, idx) => {
                    console.log("item.details:", item.details);
                    return (
                      <tr key={idx} className={isLoading ? "opacity-50" : ""}>
                        <td>{item.date}</td>
                        <td>
                          <span
                            className={`modern-badge ${
                              item.status === "מלאי תקין"
                                ? "modern-badge-success"
                                : item.status === "מלאי נמוך"
                                ? "modern-badge-warning"
                                : "modern-badge-danger"
                            }`}
                          >
                            {item.itemCode}
                          </span>
                        </td>
                        <td>
                          <strong>
                            {item.details ||
                              item.items?.item_name ||
                              item.itemName}
                          </strong>
                        </td>
                        <td>{getStatusBadge(item)}</td>
                        <td>
                          <span className="modern-badge modern-badge-info">
                            {item.quantity}
                          </span>
                        </td>
                        <td>
                          <span className="modern-badge modern-badge-info">
                            {item.totalStock}
                          </span>
                        </td>
                        <td>
                          {item.details && (
                            <button
                              className="modern-btn modern-btn-secondary"
                              style={{
                                fontSize: "0.75rem",
                                padding: "var(--space-xs) var(--space-sm)",
                              }}
                              onClick={() => fetchWikiDescription(item.details)}
                            >
                              📖 מידע
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div
            className="text-center mt-lg p-md"
            style={{
              background: "var(--secondary-50)",
              borderRadius: "var(--radius-lg)",
              color: "var(--secondary-600)",
              fontSize: "0.875rem",
            }}
          >
            עדכון אחרון: {new Date().toLocaleString("he-IL")}
          </div>
        </div>
      </div>

      {/* User Requests */}
      <div className="mb-xl">
        <UserReqList userId={userId} />
      </div>

      {/* Wiki Modal */}
      {modalOpen && (
        <div
          className="modern-modal-overlay"
          onClick={() => setModalOpen(false)}
        >
          <div className="modern-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modern-modal-header">
              <h3>{modalTitle}</h3>
              <button
                className="modern-btn modern-btn-secondary"
                onClick={() => setModalOpen(false)}
                style={{ fontSize: "1.5rem", padding: "var(--space-xs)" }}
              >
                ✕
              </button>
            </div>
            <div className="modern-modal-body">
              {wikiLoading ? (
                <div className="modern-loading">
                  <div className="modern-spinner"></div>
                  <span className="ml-md">טוען מידע מוויקיפדיה...</span>
                </div>
              ) : wikiError ? (
                <div className="modern-badge modern-badge-danger">
                  {wikiError}
                </div>
              ) : (
                <div style={{ whiteSpace: "pre-line", lineHeight: 1.6 }}>
                  {wikiDesc}
                </div>
              )}
            </div>
            <div className="modern-modal-footer">
              <button
                className="modern-btn modern-btn-primary"
                onClick={() => setModalOpen(false)}
              >
                סגור
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
