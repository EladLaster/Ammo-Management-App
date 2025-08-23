import { useEffect, useState } from "react";
import { supabase } from "../../data/supabase";
import {
  Button,
  Table,
  Card,
  Title,
  Loader,
  Text,
  Center,
  Group,
} from "@mantine/core";

function translateStatus(status) {
  const statusMap = {
    pending: "ממתינה",
    approved: "אושרה",
    rejected: "נדחתה",
    completed: "הושלמה",
  };
  return statusMap[status] || status;
}

export default function ApproveRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    fetchPending();
  }, []);

  async function fetchPending() {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("requests")
        .select(
          "id, quantity, status, created_at, item_id, unit_id, users:user_id(name), items(item_name, category)"
        )
        .eq("status", "pending");
      if (error) throw error;
      setRequests(data);
    } catch (e) {
      setError(e.message || e);
    } finally {
      setLoading(false);
    }
  }

  async function handleAction(id, newStatus) {
    setActionLoading((prev) => ({ ...prev, [id]: true }));
    try {
      // שלוף את הבקשה הרלוונטית
      const req = requests.find((r) => r.id === id);
      // עדכן סטטוס הבקשה
      const { error: reqError } = await supabase
        .from("requests")
        .update({ status: newStatus, last_updated: new Date().toISOString() })
        .eq("id", id);
      if (reqError) throw reqError;

      // אם מאושר - עדכן מלאי
      if (newStatus === "approved" && req) {
        // לוגים לאיתור בעיות
        console.log("[ApproveRequests] Approving request:", req);
        if (!req.unit_id || !req.item_id || !req.quantity) {
          alert(
            "שגיאה: נתונים חסרים או לא תקינים בבקשה (unit_id, item_id, quantity)"
          );
          return;
        }
        // בדוק אם יש מספיק מלאי ליחידה ב-inventory_admins
        const { data: adminInv, error: adminInvError } = await supabase
          .from("inventory_admins")
          .select("quantity")
          .eq("unit_id", req.unit_id)
          .eq("item_id", req.item_id)
          .maybeSingle();
        if (adminInvError) {
          console.error("[ApproveRequests] adminInvError", adminInvError);
          throw adminInvError;
        }
        if (!adminInv || adminInv.quantity < req.quantity) {
          alert("אין מספיק מלאי לאישור הבקשה (inventory_admins)");
          return;
        }
        // בדוק אם קיים רשומה במלאי
        const { data: invRows, error: invError } = await supabase
          .from("inventory_users")
          .select("quantity")
          .eq("unit_id", req.unit_id)
          .eq("item_id", req.item_id)
          .maybeSingle();
        if (invError) {
          console.error("[ApproveRequests] invError", invError);
          throw invError;
        }
        if (invRows) {
          // עדכן כמות קיימת
          const { error: updateError } = await supabase
            .from("inventory_users")
            .update({
              quantity: invRows.quantity + req.quantity,
              last_updated: new Date().toISOString(),
            })
            .eq("unit_id", req.unit_id)
            .eq("item_id", req.item_id);
          if (updateError) {
            console.error("[ApproveRequests] updateError", updateError);
            throw updateError;
          }
        } else {
          // צור רשומה חדשה
          const { error: insertError } = await supabase
            .from("inventory_users")
            .insert({
              unit_id: req.unit_id,
              item_id: req.item_id,
              quantity: req.quantity,
              last_updated: new Date().toISOString(),
            });
          if (insertError) {
            console.error("[ApproveRequests] insertError", insertError);
            throw insertError;
          }
        }
        // עדכן את המלאי של האדמין (הפחתה)
        const { error: adminUpdateError } = await supabase
          .from("inventory_admins")
          .update({
            quantity: adminInv.quantity - req.quantity,
            last_updated: new Date().toISOString(),
          })
          .eq("unit_id", req.unit_id)
          .eq("item_id", req.item_id);
        if (adminUpdateError) {
          console.error("[ApproveRequests] adminUpdateError", adminUpdateError);
          throw adminUpdateError;
        }
      }
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch (e) {
      alert("שגיאה: " + (e.message || e));
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }));
    }
  }

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
    return <Text c="dimmed">אין בקשות ממתינות לאישור</Text>;
  }
  return (
    <Card withBorder radius="md" p="md" mt="xl">
      <Title order={3} mb="sm" style={{ textAlign: "right" }}>
        בקשות ממתינות לאישור
      </Title>
      <Table
        striped
        highlightOnHover
        withColumnBorders
        style={{ direction: "rtl", textAlign: "right", fontSize: 16 }}
      >
        <thead>
          <tr>
            <th style={{ textAlign: "right", padding: "8px 16px" }}>משתמש</th>
            <th style={{ textAlign: "right", padding: "8px 16px" }}>פריט</th>
            <th style={{ textAlign: "right", padding: "8px 16px" }}>כמות</th>
            <th style={{ textAlign: "right", padding: "8px 16px" }}>סטטוס</th>
            <th style={{ textAlign: "right", padding: "8px 16px" }}>תאריך</th>
            <th style={{ textAlign: "right", padding: "8px 16px" }}>פעולות</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.id}>
              <td style={{ textAlign: "right", padding: "8px 16px" }}>
                {req.users?.name || req.user_id}
              </td>
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
              <td style={{ textAlign: "right", padding: "8px 16px" }}>
                <Group gap={4}>
                  <Button
                    size="xs"
                    color="green"
                    loading={actionLoading[req.id]}
                    onClick={() => handleAction(req.id, "approved")}
                  >
                    אשר
                  </Button>
                  <Button
                    size="xs"
                    color="red"
                    loading={actionLoading[req.id]}
                    onClick={() => handleAction(req.id, "rejected")}
                  >
                    דחה
                  </Button>
                </Group>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card>
  );
}
