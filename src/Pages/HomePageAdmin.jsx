import UnitWeatherContainer from "../components/API's/UnitWeatherContainer";
// import UserReqList from "../components/UserReqList";
import ApproveRequests from "../components/Other's/ApproveRequests";
import { observer } from "mobx-react-lite";
import { requestStore } from "../components/Store's/RequestStore";
import { useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
import { authProvider } from "../../AuthProvider/AuthProvider";
import { supabase } from "../../data/supabase";
import { dbProvider } from "../../DBProvider/DBProvider";

export const HomePageAdmin = observer(() => {
  const s = requestStore.status;
  const inventoryItems = requestStore.getInventoryItems();
  const isLoading = requestStore.isLoading;
  const error = requestStore.error;
  const navigate = useNavigate();

  const [addRow, setAddRow] = useState({
    itemType: "תחמושת",
    usageType: "",
    quantity: "",
  });
  const [addLoading, setAddLoading] = useState(false);

  useEffect(() => {
    dbProvider.loadArmorTypes(addRow.itemType);
  }, [addRow.itemType]);

  useEffect(() => {
    requestStore.refreshData();
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

  const handleAddRow = async () => {
  if (!addRow.usageType || !addRow.quantity) return;
  setAddLoading(true);
  try {
    const itemId = await dbProvider.fetchArmorIdByName(addRow.usageType);
    if (!itemId) throw new Error("סוג פריט לא נמצא");

    const unitId = authProvider.activeUser?.unit_id;
    if (!unitId) throw new Error("לא נמצא מזהה יחידה");

    const { data: existing, error: fetchError } = await supabase
      .from("inventory_admins")
      .select("quantity")
      .eq("unit_id", unitId)
      .eq("item_id", itemId)
      .maybeSingle();
    if (fetchError) throw fetchError;

    const newQuantity = existing ? existing.quantity + Number(addRow.quantity) : Number(addRow.quantity);

    const { error } = await supabase
      .from("inventory_admins")
      .upsert(
        {
          unit_id: unitId,
          item_id: itemId,
          quantity: newQuantity,
          last_updated: new Date().toISOString(),
        },
        { onConflict: ["unit_id", "item_id"] }
      );
    if (error) throw error;

    setAddRow({ itemType: addRow.itemType, usageType: "", quantity: "" });
    requestStore.refreshData();
  } catch (e) {
    alert("שגיאה בהוספה: " + (e.message || e));
  } finally {
    setAddLoading(false);
  }
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
            <h1>דף הבית - מנהל</h1>
            <p>ברוך הבא, {authProvider.activeUser.name}</p>
          </div>
          <div className="modern-nav-actions">
            {/* <button
              className="modern-btn modern-btn-secondary"
              onClick={() => navigate("/requests-admin")}
            >
              📋 בקשות ממתינות
            </button> */}
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
            {s.pendingRequests}
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

          {inventoryItems.length > 0 && (
            <div className="overflow-x-auto">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>תאריך עדכון</th>
                    <th>קוד פריט</th>
                    <th>סוג ושם פריט</th>
                    <th>סטטוס מלאי</th>
                    <th>סה"כ מלאי</th>
                    <th>פרטים נוספים</th>
                  </tr>
                  <tr>
                    <td>—</td>
                    <td>—</td>
                    <td>
                      <select
                        value={addRow.itemType}
                        onChange={e => setAddRow({ ...addRow, itemType: e.target.value, usageType: "" })}
                        style={{ minWidth: 90, marginLeft: 4 }}
                      >
                        <option value="תחמושת">תחמושת</option>
                        <option value="נשק">נשק</option>
                        <option value="ציוד">ציוד</option>
                      </select>
                      <select
                        value={addRow.usageType}
                        onChange={e => setAddRow({ ...addRow, usageType: e.target.value })}
                        style={{ minWidth: 120 }}
                      >
                        <option value="">בחר סוג תחמושת</option>
                        {dbProvider.armorTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </td>
                    <td>—</td>
                    <td>
                      <input
                        type="number"
                        min={1}
                        placeholder="כמות"
                        value={addRow.quantity}
                        onChange={e => setAddRow({ ...addRow, quantity: e.target.value })}
                        style={{ width: 70 }}
                      />
                    </td>
                    <td>
                      <button
                        className="modern-btn modern-btn-primary"
                        onClick={handleAddRow}
                        disabled={addLoading}
                      >
                        {addLoading ? "מוסיף..." : "הוסף"}
                      </button>
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {inventoryItems.map((item, idx) => (
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
                          {item.totalStock}
                        </span>
                      </td>
                      <td className="text-secondary-600">{item.details}</td>
                    </tr>
                  ))}
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


      {/* Approve Requests */}
      <div className="modern-card">
        <div className="p-xl">
          <ApproveRequests />
        </div>
      </div>
    </div>
  );
});
