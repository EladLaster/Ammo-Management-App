import { useEffect, useState } from "react";
import { Card, Title, Table, Loader, Text, Center } from "@mantine/core";
import { supabase } from "../../data/supabase";

function UserInventory({ unitId }) {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchInventory() {
      setLoading(true);
      setError(null);
      try {
        if (!unitId) {
          setInventory([]);
          setLoading(false);
          return;
        }
        const { data, error } = await supabase
          .from("inventory_users")
          .select("item_id, quantity, items(item_name, category)")
          .eq("unit_id", unitId);
        if (error) throw error;
        setInventory(data);
      } catch (e) {
        setError(e.message || e);
      } finally {
        setLoading(false);
      }
    }
    fetchInventory();
  }, [unitId]);

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
  if (!inventory || inventory.length === 0) {
    return <Text c="dimmed">אין מלאי להצגה</Text>;
  }
  return (
    <Card withBorder radius="md" p="md" mt="xl">
      <Title
        order={2}
        mb="sm"
        style={{ textAlign: "right", fontSize: 28, fontWeight: 700 }}
      >
        המלאי של היחידה שלי
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
            <th style={{ textAlign: "right", padding: "8px 16px" }}>קטגוריה</th>
            <th style={{ textAlign: "right", padding: "8px 16px" }}>כמות</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((inv) => (
            <tr key={inv.item_id}>
              <td
                style={{
                  textAlign: "right",
                  padding: "8px 16px",
                  fontWeight: 500,
                }}
              >
                {inv.items?.item_name || inv.item_id}
              </td>
              <td style={{ textAlign: "right", padding: "8px 16px" }}>
                {inv.items?.category || ""}
              </td>
              <td style={{ textAlign: "right", padding: "8px 16px" }}>
                {inv.quantity}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card>
  );
}

export default UserInventory;
