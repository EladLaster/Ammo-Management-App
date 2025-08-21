/* Requires: npm i mobx mobx-react-lite
   File: src/Lior/Pages/HomePageUser.jsx
*/
import { useEffect } from "react";
import {
  Container,
  Title,
  Group,
  Button,
  Card,
  Loader,
  Text,
  Center,
} from "@mantine/core";
import { observer } from "mobx-react-lite";
import InventoryTable from "../components/InventoryTable";
import { stockStore } from "../stores";

// Minimal home page: button (no navigation yet) + inventory table,
// with basic loading, error, and empty states from the store
const HomePageUser = observer(function HomePageUser() {
  useEffect(() => {
    // Load once on mount
    stockStore.load();
  }, []);

  const handleNewRequestClick = () => {
    // TODO: open request form page later
    console.log("New Request clicked");
  };

  // Get state from store
  const { isLoading, error, myInventory } = stockStore;

  return (
    <Container size="lg" pt="md" pb="xl" style={{ direction: "rtl" }}>
      <Group justify="space-between" mb="md">
        <Title order={2}>דף בית משתמש</Title>
        <Button onClick={handleNewRequestClick}>בקשה חדשה</Button>
      </Group>

      <Card withBorder radius="md" p="md">
        <Title order={4} mb="sm">
          המלאי שלי ביחידה
        </Title>

        {/* Loading */}
        {isLoading && (
          <Center my="lg">
            <Loader />
          </Center>
        )}

        {/* Error */}
        {!isLoading && error && (
          <Text c="red" fw={500}>
            שגיאה בטעינת המלאי: {String(error)}
          </Text>
        )}

        {/* Empty */}
        {!isLoading && !error && (!myInventory || myInventory.length === 0) && (
          <Text c="dimmed">אין נתונים להצגה כרגע.</Text>
        )}

        {/* Table */}
        {!isLoading && !error && myInventory && myInventory.length > 0 && (
          <InventoryTable items={myInventory} />
        )}
      </Card>
    </Container>
  );
});

export default HomePageUser;
