// src/components/Inventory.jsx
import { observer } from "mobx-react-lite";
import { requestStore } from "./RequestStore";
import { useState } from "react";
import "./Inventory.css";

export const Inventory = observer(() => {
  const [search, setSearch] = useState("");

  const filtered = requestStore.requests.filter(r =>
    r.requester.includes(search)
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

  return (
    <div className="inventoryContainer">
      <div className="inventoryHeader">
        <h2>מלאי כללי</h2>
        <input
          type="text"
          placeholder="חיפוש סוג תחמושת..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="searchInput"
        />
      </div>

      <div className="actionButtons">
        <button className="actionBtn approveBtn">✓ אישור בקשה</button>
        <button className="actionBtn rejectBtn">📋 דו"ח מלאי </button>
        <button className="actionBtn addBtn">+ בקשה חדשה</button>
      </div>

      <table className="inventoryTable">
        <thead>
          <tr>
            <th>תאריך בקשה</th>
            <th>מספר חטיבה</th>
            <th>שם פלוגה</th>
            <th>סטטוס בקשה</th>
            <th>סוג תחמושת</th>
            <th>כמות מבוקשת</th>
            <th>עדיפות</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((r, idx) => (
            <tr key={idx}>
              <td>{r.requestDate}</td>
              <td>
                <span className="unitNumber"> גדוד {r.unitNumber}</span>
              </td>
              <td>{r.requester}</td>
              <td>{getStatusBadge(r.status)}</td>
              <td>{r.ammoType}</td>
              <td>{r.quantity}</td>
              <td className={getPriorityClass(r.priority)}>
                {r.priority === "גבוהה" && "🔴"} 
                {r.priority === "בינונית" && "🟡"}
                {r.priority === "נמוכה" && "🟢"}
                {r.priority}
              </td>
              
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});