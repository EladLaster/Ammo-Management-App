// src/components/Inventory.jsx
import { observer } from "mobx-react-lite";
import { requestStore } from "./RequestStore";
import { authProvider } from "../../AuthProvider/AuthProvider";
import { useEffect, useState } from "react";
import "./Inventory.css";

export const Inventory = observer(() => {
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const activeUser = authProvider.getActiveUser();
  
  useEffect(() => {
    const loadUserRequests = async () => {
      if (activeUser?.unit_id) {
        setIsLoading(true);
        try {
          // טעינת בקשות ליחידה של המשתמש המחובר
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

  // סינון לפי סוג תחמושת בלבד
  const filtered = requestStore.requests.filter(r =>
    r.requester.includes(search) ||
    r.ammoType.includes(search) ||
    r.unitNumber.includes(search)
  );

  const getStatusBadge = (status) => {
    const statusClasses = {
      "ממתינה": "statusWaiting",
      "אושרה": "statusApproved", 
      "נדחתה": "statusRejected"
    };

    const statusIcons = {
      "ממתינה": "⏳",
      "אושרה": "✅",
      "נדחתה": "❌"
    };

    return (
      <span className={`statusBadge ${statusClasses[status]}`}>
        <span>{statusIcons[status]}</span>
        {status}
      </span>
    );
  };

  const getPriorityClass = (priority) => {
    switch(priority) {
      case "גבוהה": return "priorityHigh";
      case "בינונית": return "priorityMedium";
      case "נמוכה": return "priorityLow";
      default: return "";
    }
  };

  if (!activeUser) {
    return (
      <div className="inventoryContainer">
        <div className="errorMessage">
          <h3>שגיאה: משתמש לא מחובר</h3>
          <p>אנא התחבר למערכת כדי לצפות בבקשות</p>
        </div>
      </div>
    );
  }

  if (isLoading || requestStore.isRequestsLoading) {
    return (
      <div className="inventoryContainer">
        <div className="loadingMessage">
          <h3>טוען בקשות...</h3>
          <p>אנא המתן</p>
        </div>
      </div>
    );
  }

  return (
    <div className="inventoryContainer">
      <div className="inventoryHeader">
        <h2>בקשות יחידה: {activeUser.unit_id ? `יחידה ${activeUser.unit_id}` : 'לא זוהתה יחידה'}</h2>
        <input
          type="text"
          placeholder="חיפוש לפי בקשה, סוג תחמושת או מבקש..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="searchInput"
        />
      </div>

      {requestStore.error && (
        <div className="errorMessage">
          <p>{requestStore.error}</p>
          <button onClick={() => requestStore.clearError()}>סגור</button>
        </div>
      )}

       <div className="requestsStats">
        <div className="stat">
          <span>סה"כ בקשות: </span>
          <strong>{filtered.length}</strong>
        </div>
        <div className="stat">
          <span>ממתינות: </span>
          <strong>{filtered.filter(r => r.originalStatus === 'pending').length}</strong>
        </div>
        <div className="stat">
          <span>אושרו: </span>
          <strong>{filtered.filter(r => r.originalStatus === 'approved').length}</strong>
        </div>
        <div className="stat">
          <span>הושלמו: </span>
          <strong>{filtered.filter(r => r.originalStatus === 'completed').length}</strong>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="noRequests">
          <h3>אין בקשות להציג</h3>
          <p>לא נמצאו בקשות עבור היחידה שלך או החיפוש שלך</p>
        </div>
      ) : (

      <table className="inventoryTable">
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
              <td>{r.unitNumber}</td>
              <td>{getStatusBadge(r.status)}</td>
              <td>{r.quantity}</td>
              <td>{r.ammoType}</td>
              <td className={getPriorityClass(r.priority)}>
                {r.priority === "גבוהה" && "🔴"} 
                {r.priority === "בינונית" && "🟡"}
                {r.priority === "נמוכה" && "🟢"}
                {r.priority}
              </td>
              <td>{r.requester}</td>
              
            </tr>
          ))}
        </tbody>
      </table>
      )}
    </div>
  );
});
