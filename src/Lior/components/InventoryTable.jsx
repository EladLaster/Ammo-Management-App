function InventoryTable({ items }) {
  if (!items || items.length === 0) {
    return (
      <div style={{ padding: 24, textAlign: "center" }}>אין נתונים במלאי</div>
    );
  }
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16 }}>
      <thead>
        <tr>
          <th style={{ border: "1px solid #ccc", padding: 8 }}>שם פריט</th>
          <th style={{ border: "1px solid #ccc", padding: 8 }}>כמות</th>
          <th style={{ border: "1px solid #ccc", padding: 8 }}>מזהה פריט</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id || item.item_id}>
            <td style={{ border: "1px solid #ccc", padding: 8 }}>
              {item.products?.name}
            </td>
            <td style={{ border: "1px solid #ccc", padding: 8 }}>
              {item.quantity}
            </td>
            <td style={{ border: "1px solid #ccc", padding: 8 }}>
              {item.id || item.item_id}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default InventoryTable;
