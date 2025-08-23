import { useEffect, useState } from "react";
import { Card, Title, Table, Loader, Text, Center } from "@mantine/core";
import { supabase } from "../../data/supabase";

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
      <Title order={4} mb="sm">
        הבקשות שלי
      </Title>
      <Table striped highlightOnHover withColumnBorders>
        <thead>
          <tr>
            <th>מזהה</th>
            <th>פריט</th>
            <th>כמות</th>
            <th>סטטוס</th>
            <th>תאריך</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.id}>
              <td>{req.id}</td>
              <td>{req.items?.item_name || req.item_id}</td>
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
      </Table>
    </Card>
  );
}

export default UserReqList;
