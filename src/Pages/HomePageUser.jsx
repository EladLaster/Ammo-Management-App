import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { requestStore } from "../components/RequestStore";
import "./HomePageAdmin.css";
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
      "מלאי תקין": { class: "statusGreen", icon: "🛡️" },
      "מלאי נמוך": { class: "statusYellow", icon: "⚡" },
      "מלאי קריטי": { class: "statusRed", icon: "❌" },
    };

    const config = statusConfig[item.status] || statusConfig["מלאי תקין"];

    return (
      <span className={`inventoryStatusBadge ${config.class}`}>
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
      <div className="statusContainer">
        <div className="errorMessage">
          שגיאה בטעינת הנתונים: {error}
          <button onClick={handleRefresh} className="refreshBtn">
            נסה שוב
          </button>
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
    <>
      <UnitWeatherContainer />
      <div className="pageTitle" style={{ gap: 0 }}>
        <button
          className="requestsButton"
          style={{
            right: "20px",
            left: "unset",
            background: "white",
            color: "#764ba2",
          }}
          onClick={() => {
            navigate("/form");
          }}
        >
          בקשה חדשה
        </button>
        <h1>
          דף הבית (משתמש){" "}
          <span style={{ fontWeight: 400, fontSize: 20, color: "#e0e0e0" }}>
            {authProvider.activeUser.name}
          </span>
        </h1>
        <button
          className="requestsButton"
          style={{
            left: "20px",
            right: "unset",
            background: "#e74c3c",
            color: "white",
          }}
          onClick={async () => {
            await authProvider.handleLogout();
            navigate("/");
          }}
        >
          התנתק
        </button>
      </div>
      <div className="statusContainer">
        <div className="statusTitle">
          סקירה כללית של מצב המלאי ופעילויות אחרונות
          {isLoading && <span className="loadingSpinner">⏳ טוען...</span>}
        </div>
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
            <span className="boxNumber">{s.lowStockItems}</span>
            <div className="boxLabel">פריטים במלאי נמוך</div>
          </div>
          <div className="box">
            <span className="boxNumber">{userPendingRequests}</span>
            <div className="boxLabel">בקשות ממתינות</div>
          </div>
        </div>

        <div className="inventoryReportContainer">
          <div className="inventoryReportHeader">
            <h3>דו"ח מלאי</h3>
            <button
              onClick={handleRefresh}
              className="refreshBtn"
              disabled={isLoading}
            >
              {isLoading ? "⏳" : "🔄"} רענן
            </button>
          </div>

          {inventoryItems.length === 0 && !isLoading ? (
            <div className="noDataMessage">אין נתונים להצגה</div>
          ) : (
            <table className="inventoryReportTable">
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
                  console.log('item.details:', item.details);
                  return (
                  <tr key={idx} className={isLoading ? "loading-row" : ""}>
                    <td>{item.date}</td>
                    <td>
                      <span
                        className={`itemCode ${
                          item.status === "מלאי תקין"
                            ? "codeGreen"
                            : item.status === "מלאי נמוך"
                            ? "codeYellow"
                            : "codeRed"
                        }`}
                      >
                        {item.itemCode}
                      </span>
                    </td>
                    <td>
                      {item.details || item.items?.item_name || item.itemName}
                    </td>
                    <td>{getStatusBadge(item)}</td>
                    <td className="quantityCell">{item.quantity}</td>
                    <td className="stockCell">{item.totalStock}</td>
                    <td className="detailsCell">
                      {item.details && (
                        <button
                          className="wikiDetailsBtn"
                          style={{
                            cursor: "pointer",
                            color: "#764ba2",
                            background: "none",
                            border: "none",
                            textDecoration: "underline",
                          }}
                          onClick={() => fetchWikiDescription(item.details)}
                        >
                          מידע
                        </button>
                      )}
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          )}

          <div className="inventoryFooter">
            <span>עדכון אחרון: {new Date().toLocaleString("he-IL")}</span>
          </div>

          {/* Wiki Modal */}
          {modalOpen && (
            <div
              className="wikiModalBg"
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "rgba(0,0,0,0.3)",
                zIndex: 1000,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                className="wikiModal"
                style={{
                  background: "white",
                  padding: 24,
                  borderRadius: 8,
                  maxWidth: 500,
                  minWidth: 300,
                }}
              >
                <h2 style={{ marginTop: 0 }}>{modalTitle}</h2>
                {wikiLoading ? (
                  <div>טוען מידע מוויקיפדיה...</div>
                ) : wikiError ? (
                  <div style={{ color: "red" }}>{wikiError}</div>
                ) : (
                  <div style={{ whiteSpace: "pre-line" }}>{wikiDesc}</div>
                )}
                <button
                  style={{ marginTop: 16 }}
                  onClick={() => setModalOpen(false)}
                >
                  סגור
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* רשימת הבקשות שלי */}
      <UserReqList userId={userId} />
    </>
  );
});
