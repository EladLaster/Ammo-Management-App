import {
  Button,
  Group,
  NumberInput,
  Radio,
  Select,
  Stack,
  Textarea,
  Center,
  Paper,
  Title,
  Divider,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import "dayjs/locale/he";
import { authProvider } from "../../AuthProvider/AuthProvider";
import { observer } from "mobx-react-lite";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { dbProvider } from "../../DBProvider/DBProvider";

// אייקונים
import {
  IconBox,
  IconCalendar,
  IconClipboard,
} from "@tabler/icons-react";

const FormPage = observer(() => {
  const navigate = useNavigate();
  const [choosenArmorId, setChoosenArmorId] = useState("");

  const form = useForm({
    initialValues: {
      requestType: "",
      usageType: "",
      quantity: 0,
      priority: "medium",
      usageDate: null,
      purpose: "",
      justification: "",
    },
    validate: {
      requestType: (v) => (!v ? "שדה חובה" : null),
      usageType: (v) => (!v ? "שדה חובה" : null),
      quantity: (v) => (v <= 0 ? "חובה להזין כמות" : null),
      usageDate: (v) => (!v ? "נא לבחור תאריך" : null),
      justification: (v) =>
        v.trim().length < 5 ? "נא להזין הצדקה מפורטת" : null,
    },
  });

  useEffect(() => {
    const fetchId = async () => {
      if (form.values.usageType) {
        const id = await dbProvider.fetchArmorIdByName(form.values.usageType);
        if (id) {
          setChoosenArmorId(id.toString());
        } else {
          setChoosenArmorId("");
        }
      }
    };
    fetchId();
  }, [form.values.usageType]);

  useEffect(() => {
    dbProvider.loadArmorTypes(form.values.requestType);
  }, [form.values.requestType]);

  const handleSubmit = async () => {
    try {
      const userId = authProvider.activeUser?.id;
      const unitId = authProvider.activeUser?.unit_id;

      if (!userId || !unitId || !choosenArmorId) {
        notifications.show({
          color: "red",
          message: "חסרים נתונים לשליחת הבקשה",
        });
        return;
      }
      if (typeof userId !== "number" || isNaN(userId)) {
        notifications.show({
          color: "red",
          message:
            "שגיאה: מזהה המשתמש אינו מספר. ודא שאתה מחובר עם משתמש קיים מהטבלה Users.",
        });
        return;
      }
      if (typeof unitId !== "number" || isNaN(unitId)) {
        notifications.show({
          color: "red",
          message:
            "שגיאה: מזהה היחידה אינו מספר. ודא שלמשתמש שלך משויכת יחידה קיימת.",
        });
        return;
      }

      await dbProvider.insertNewRequest(
        userId,
        unitId,
        Number(choosenArmorId),
        form.values.quantity,
        "pending"
      );

      notifications.show({ color: "green", message: "הבקשה נשלחה בהצלחה!" });
      form.reset();

      setTimeout(() => {
        navigate(-1);
      }, 700);
    } catch (error) {
      notifications.show({ color: "red", message: "אירעה שגיאה בשליחת הבקשה" });
      console.error("Error submitting request:", error);
    }
  };

  return (
    <Center style={{ minHeight: "100vh" }}>
      <Paper shadow="md" radius="lg" p="xl" withBorder dir="rtl" style={{ backgroundColor: "#e6d7ba",position: "relative" }}>
        <Button
  size="xs"
  variant="filled"
  color="red"
  styles={(theme) => ({
    root: {
      position: "absolute",
      top: 10,
      right: 10,
      minWidth: "40px",
      padding: "0 6px",
      fontWeight: 600,
      "&:hover": {
        backgroundColor: "red",
      },
    },
  })}
  onClick={() => navigate("/home-user")}
>
  ✕
</Button>

        <Title order={2} ta="center" mb="md" styles={{backgroundColor: "rgb(62, 68, 32)"}}>
          הגשת בקשה חדשה
        </Title>
        <Divider my="sm" />

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack spacing="md">
            <Select
              label="סוג הבקשה"
              placeholder="בחר סוג בקשה"
              data={["נשק", "תחמושת", "ציוד"]}
              leftSection={<IconBox size={16} />}
              {...form.getInputProps("requestType")}
            />

            <Select
              label="סוג התחמושות"
              placeholder="בחר סוג תחמושת"
              data={dbProvider.armorTypes}
              leftSection={<IconBox size={16} />}
              {...form.getInputProps("usageType")}
            />

            <Group grow>
              <NumberInput
                label="כמות"
                placeholder="לדוגמה: 100"
                min={1}
                {...form.getInputProps("quantity")}
              />

              <DateInput
                label="תאריך דרוש"
                placeholder="בחר תאריך"
                valueFormat="DD/MM/YYYY"
                locale="he"
                leftSection={<IconCalendar size={16} />}
                {...form.getInputProps("usageDate")}
              />
            </Group>

            <Radio.Group label="דרגת עדיפות" {...form.getInputProps("priority")} color="rgb(62, 68, 32)" >
              <Group mt="xs">
                <Radio value="low" label="נמוכה" />
                <Radio value="medium" label="בינונית" />
                <Radio value="high" label="גבוהה" />
                <Radio value="urgent" label="דחוף" />
              </Group>
            </Radio.Group>

            <Textarea
              label="הצדקה לבקשה"
              placeholder="לדוגמה: נדרש 100 פצמ"
              autosize
              minRows={3}
              leftSection={<IconClipboard size={16} />}
              {...form.getInputProps("justification")}
            />

            <Button
              type="submit"
              color="blue"
              size="md"
              fullWidth
              leftSection={<IconClipboard />}
              styles={(theme) => ({
              root: {
                backgroundColor: "rgb(62, 68, 32)",
                color: "white",
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: "rgb(50, 55, 28)",
                },
              },
            })}
            >
              שלח בקשה
            </Button>
          </Stack>
        </form>
      </Paper>
    </Center>
  );
});

export { FormPage };
