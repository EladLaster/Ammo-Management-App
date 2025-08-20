import "./Inventory.css"

export function Inventory(){
    return (
        <div className="inventoryContainer">
            <div className="inventoryHeader">
                <button className="BTNrefresh">רענון</button>
                <h2>מלאי כללי</h2>
            </div>
            <div className="inventoryBody">
                <input
                type="text"
                placeholder="חפש סוג תחמושת"
                
                ></input>
            </div>
        </div>
    )
}