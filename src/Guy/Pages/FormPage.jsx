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

export function FormPage() {
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

  return (
    <div dir="rtl">
        <form onSubmit={form.onSubmit(console.log)}>
        <Stack>
            <Select
            label="סוג הבקשה"
            placeholder="בחר סוג בקשה"
            data={["חימוש", "תחמושת", "ציוד"]}
            {...form.getInputProps("requestType")}
            />

            <Select
            label="סוג התחמושות"
            placeholder="בחר סוג התממשות"
            data={["תרגיל", "מבצע", "שמירה"]}
            {...form.getInputProps("usageType")}
            />

            <NumberInput
            label="כמות"
            placeholder="לדוגמה: 100"
            min={1}
            {...form.getInputProps("quantity")}
            />

            <Radio.Group
            label="דרגת עדיפות"
            {...form.getInputProps("priority")}
            >
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
}
