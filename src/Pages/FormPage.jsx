import {
  Button,
  Group,
  NumberInput,
  Radio,
  Select,
  Stack,
  Textarea,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import "dayjs/locale/he";
import { supabase } from "../../data/supabase";
import { authProvider } from "../../AuthProvider/AuthProvider";
import { observer } from "mobx-react-lite";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { dbProvider } from "../../DBProvider/DBProvider";

const FormPage = observer(() => {
  const navigate = useNavigate();
  // const [armorTypes, setArmorTypes] = useState([]);
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
      // בדיקת תקינות ערכים
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
        navigate(-1); // חזרה לעמוד הקודם
      }, 700);
    } catch (error) {
      notifications.show({ color: "red", message: "אירעה שגיאה בשליחת הבקשה" });
      console.error("Error submitting request:", error);
    }
  };

  return (
    <div dir="rtl">
      <h2>הגשת בקשה חדשה: </h2>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <Select
            label="סוג הבקשה"
            placeholder="בחר סוג בקשה"
            data={["נשק", "תחמושת", "ציוד"]}
            {...form.getInputProps("requestType")}
          />

          <Select
            label="סוג התחמושות"
            placeholder="בחר סוג התממשות"
            data={dbProvider.armorTypes}
            {...form.getInputProps("usageType")}
          />

          <NumberInput
            label="כמות"
            placeholder="לדוגמה: 100"
            min={1}
            {...form.getInputProps("quantity")}
          />

          <Radio.Group label="דרגת עדיפות" {...form.getInputProps("priority")}>
            <Group mt="xs">
              <Radio value="low" label="נמוכה" />
              <Radio value="medium" label="בינונית" />
              <Radio value="high" label="גבוהה" />
              <Radio value="urgent" label="דחוף" />
            </Group>
          </Radio.Group>

          <DateInput
            label="תאריך דרוש"
            placeholder="בחר תאריך"
            valueFormat="DD/MM/YYYY"
            locale="he"
            {...form.getInputProps("usageDate")}
          />

          <Select
            label="מטרת השימוש"
            placeholder="בחר מטרה"
            data={["אימון", "לחימה", "שמירה"]}
            {...form.getInputProps("purpose")}
          />

          <Textarea
            label="הצדקה לבקשה"
            placeholder="לדוגמה: נדרש 100 פצמ"
            autosize
            minRows={3}
            {...form.getInputProps("justification")}
          />

          <Button type="submit">שלח בקשה</Button>
        </Stack>
      </form>
    </div>
  );
});

export { FormPage };
