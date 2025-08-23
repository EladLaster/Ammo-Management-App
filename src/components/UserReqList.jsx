import { useEffect, useState } from "react";
import { Card, Title, Table, Loader, Text, Center } from "@mantine/core";
import { supabase } from "../../data/supabase";

function translateStatus(status) {
  const statusMap = {
    pending: "ממתינה",
    approved: "אושרה",
    rejected: "נדחתה",
    completed: "הושלמה",
  };
  return statusMap[status] || status;
}

function UserReqList({ userId }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRequests() {
      setLoading(true);
      setError(null);
      try {
        if (!userId) {
          setRequests([]);
          setLoading(false);
          return;
        }
        const { data, error } = await supabase
          .from("requests")
          .select(
            "id, quantity, status, created_at, item_id, items(item_name, category)"
          )
          .eq("user_id", userId);
        if (error) throw error;
        setRequests(data);
      } catch (e) {
        setError(e.message || e);
      } finally {
        setLoading(false);
      }
    }
    fetchRequests();
  }, [userId]);

  if (loading)
    return (
      <Center my="lg">
        <Loader />
      </Center>
    );
  if (error)
    return (
      <Text c="red" fw={500}>
        שגיאה: {error}
      </Text>
    );
  if (!requests || requests.length === 0) {
    return <Text c="dimmed">אין בקשות להצגה</Text>;
  }
  return (
    <Card withBorder radius="md" p="md" mt="xl">
      <Title
        order={2}
        mb="sm"
        style={{ textAlign: "right", fontSize: 32, fontWeight: 800 }}
      >
        הבקשות שלי
      </Title>
      <Table
        striped
        highlightOnHover
        withColumnBorders
        style={{ direction: "rtl", textAlign: "right", fontSize: 16 }}
      >
        <thead>
          <tr>
            <th style={{ textAlign: "right", padding: "8px 16px" }}>פריט</th>
            <th style={{ textAlign: "right", padding: "8px 16px" }}>כמות</th>
            <th style={{ textAlign: "right", padding: "8px 16px" }}>סטטוס</th>
            <th style={{ textAlign: "right", padding: "8px 16px" }}>תאריך</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.id}>
              <td
                style={{
                  textAlign: "right",
                  padding: "8px 16px",
                  fontWeight: 500,
                }}
              >
                {req.items?.item_name || req.item_id}
              </td>
              <td style={{ textAlign: "right", padding: "8px 16px" }}>
                {req.quantity}
              </td>
              <td style={{ textAlign: "right", padding: "8px 16px" }}>
                {translateStatus(req.status)}
              </td>
              <td style={{ textAlign: "right", padding: "8px 16px" }}>
                {req.created_at
                  ? new Date(req.created_at).toLocaleDateString("he-IL")
                  : ""}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card>
  );
}

export default UserReqList;
