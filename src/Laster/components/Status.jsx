import "./Status.css"

export function Status(){
    return (
        <div className="boxContainer">
            <div className="box">
                {/* {ammo.type} */}
                <h3>סוגי תחמושת</h3>
            </div>
            <div className="box">
                {/* {ammo.unitsInStock} */}
                <h3>יחידות במלאי</h3>
            </div>
            <div className="box">
                {/* {ammo.lowStockItems} */}
                <h3>פריטים במלאי נמוך</h3>
            </div>
            <div className="box">
                {/* {ammo.pendingRequests} */}
                <h3>בקשות ממתינות</h3>
            </div>
        </div>
    )
}