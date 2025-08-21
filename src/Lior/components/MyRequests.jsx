function MyRequests({ requests }) {
  if (!requests || requests.length === 0) {
    return (
      <div style={{ padding: 24, textAlign: "center" }}>אין בקשות להצגה</div>
    );
  }
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16 }}>
      <thead>
        <tr>
          <th>מזהה</th>
          <th>שם פריט</th>
          <th>כמות</th>
          <th>סטטוס</th>
          <th>תאריך</th>
        </tr>
      </thead>
      <tbody>
        {requests.map((req) => (
          <tr key={req.id}>
            <td>{req.id}</td>
            <td>{req.products?.name}</td>
            <td>{req.quantity}</td>
            <td>{req.status}</td>
            <td>
              {req.created_at
                ? new Date(req.created_at).toLocaleDateString()
                : ""}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default MyRequests;
