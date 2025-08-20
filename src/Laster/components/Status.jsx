// src/components/Status.jsx
import { observer } from "mobx-react-lite";
import { requestStore } from "./RequestStore";
import "./Status.css";

export const Status = observer(() => {
  const s = requestStore.status;
  const inventoryItems = requestStore.getInventoryItems();

  const getStatusBadge = (item) => {
    const statusConfig = {
      "מלאי תקין": { class: "statusGreen", icon: "🛡️" },
      "מלאי נמוך": { class: "statusYellow", icon: "⚡" },
      "מלאי קריטי": { class: "statusRed", icon: "❌" }
    };
    
    const config = statusConfig[item.status] || statusConfig["מלאי תקין"];
    
    return (
      <span className={`inventoryStatusBadge ${config.class}`}>
        {item.statusIcon} {item.status}
      </span>
    );
  };

  return (
    <div className="statusContainer">
      <div className="statusTitle">סקירה כללית של מצב המלאי ופעילויות אחרונות</div>
      <div className="boxContainer">
        <div className="box">
          <span className="boxNumber">{s.ammoTypes}</span>
          <div className="boxLabel">סוגי תחמושות</div>
        </div>
        <div className="box">
          <span className="boxNumber">{s.unitsInStock.toLocaleString()}</span>
          <div className="boxLabel">יחידות במלאי</div>
        </div>
        <div className="box">
          <span className="boxNumber">{s.pendingRequests}</span>
          <div className="boxLabel">פריטים במלאי נמוך</div>
        </div>
        <div className="box">
          <span className="boxNumber">{s.lowStockItems}</span>
          <div className="boxLabel">בקשות ממתינות</div>
        </div>
      </div>

      <div className="inventoryReportContainer">
        <div className="inventoryReportHeader">
          <h3>דו"ח מלאי</h3>
        </div>
        
        <table className="inventoryReportTable">
          <thead>
            <tr>
              <th>תאריך עדכון</th>
              <th>שם פריט</th>
              <th>קוד פריט</th>
              <th>סטטוס מלאי</th>
              <th>כמות זמינה</th>
              <th>יחידת מידה</th>
              <th>סה"כ מלאי</th>
              <th>פרטים נוספים</th>
            </tr>
          </thead>
          <tbody>
            {inventoryItems.map((item, idx) => (
              <tr key={idx}>
                <td>{item.date}</td>
                <td>{item.itemName}</td>
                <td>
                  <span className={`itemCode ${item.status === 'מלאי תקין' ? 'codeGreen' : item.status === 'מלאי נמוך' ? 'codeYellow' : 'codeRed'}`}>
                    {item.itemCode}
                  </span>
                </td>
                <td>{getStatusBadge(item)}</td>
                <td className="quantityCell">{item.quantity}</td>
                <td>{item.unit}</td>
                <td className="stockCell">{item.totalStock}</td>
                <td className="detailsCell">{item.details}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="inventoryFooter">
          <span>עדכון אחרון: 19/08/2025 בשעה 14:30</span>
        </div>
      </div>
    </div>
  );
});