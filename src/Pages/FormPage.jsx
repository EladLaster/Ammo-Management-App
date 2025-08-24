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
import { authProvider } from "../../AuthProvider/AuthProvider";
import { observer } from "mobx-react-lite";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { dbProvider } from "../../DBProvider/DBProvider";

import { IconBox, IconCalendar, IconClipboard } from "@tabler/icons-react";

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
    <div className="modern-container min-h-screen flex items-center justify-center">
      <div className="modern-card" style={{ width: "100%", maxWidth: 600 , position: "relative"}}>
        <div className="p-xl">
          {/* Header */}
          <div className="modern-header text-center mb-xl">
            <h1>הגשת בקשה חדשה</h1>
            <p>מלא את הפרטים להעברת בקשה לתחמושות</p>
          </div>

          {/* Close Button */}
          <button
            className="modern-btn modern-btn-danger"
            style={{
              position: "absolute",
              top: "var(--space-lg)",
              right: "var(--space-lg)",
              minWidth: "40px",
              padding: "var(--space-xs)",
              fontSize: "1.2rem",
              transition: "all 0.2s ease", 
              backgroundColor: "var(--danger-500)", 
              color: "white",
              borderRadius: "4px",
            }}
            onClick={() => navigate("/home-user")}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--danger-400)";
              e.currentTarget.style.transform = "scale(1.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "var(--danger-500)";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            x
          </button>


          {/* Form */}
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="lg">
              <div className="modern-grid modern-grid-2">
                <Select
                  label="סוג הבקשה"
                  placeholder="בחר סוג בקשה"
                  data={["נשק", "תחמושת", "ציוד"]}
                  leftSection={<IconBox size={16} />}
                  {...form.getInputProps("requestType")}
                  radius="lg"
                  size="md"
                  styles={{
                    input: {
                      borderColor: "var(--secondary-300)",
                      "&:focus": {
                        borderColor: "var(--primary-500)",
                        boxShadow: "0 0 0 3px var(--primary-100)",
                      },
                    },
                  }}
                />

                <Select
                  label="סוג התחמושות"
                  placeholder="בחר סוג תחמושת"
                  data={dbProvider.armorTypes}
                  leftSection={<IconBox size={16} />}
                  {...form.getInputProps("usageType")}
                  radius="lg"
                  size="md"
                  styles={{
                    input: {
                      borderColor: "var(--secondary-300)",
                      "&:focus": {
                        borderColor: "var(--primary-500)",
                        boxShadow: "0 0 0 3px var(--primary-100)",
                      },
                    },
                  }}
                />
              </div>

              <div className="modern-grid modern-grid-2">
                <NumberInput
                  label="כמות"
                  placeholder="לדוגמה: 100"
                  min={1}
                  value={form.values.quantity || undefined}
                  {...form.getInputProps("quantity")}
                  radius="lg"
                  size="md"
                  styles={{
                    input: {
                      textAlign: "right", 
                      borderColor: "var(--secondary-300)",
                      "&:focus": {
                        borderColor: "var(--primary-500)",
                        boxShadow: "0 0 0 3px var(--primary-100)",
                      },
                    },
                  }}
                />

                <DateInput
                  label="תאריך דרוש"
                  placeholder="בחר תאריך"
                  valueFormat="DD/MM/YYYY"
                  locale="he"
                  leftSection={<IconCalendar size={16} />}
                  {...form.getInputProps("usageDate")}
                  radius="lg"
                  size="md"
                  styles={{
                    input: {
                      borderColor: "var(--secondary-300)",
                      "&:focus": {
                        borderColor: "var(--primary-500)",
                        boxShadow: "0 0 0 3px var(--primary-100)",
                      },
                    },
                  }}
                />
              </div>

              <div
                className="modern-card p-lg"
                style={{ background: "var(--secondary-50)" }}
              >
                <Radio.Group
                  label="דרגת עדיפות"
                  {...form.getInputProps("priority")}
                  color="var(--military-green)"
                >
                  <div className="modern-grid modern-grid-4 mt-sm">
                    <Radio value="low" label="נמוכה" />
                    <Radio value="medium" label="בינונית" />
                    <Radio value="high" label="גבוהה" />
                    <Radio value="urgent" label="דחוף" />
                  </div>
                </Radio.Group>
              </div>

              <Textarea
                label="הצדקה לבקשה"
                placeholder="לדוגמה: נדרש 100 פצמ"
                autosize
                minRows={3}
                leftSection={<IconClipboard size={16} />}
                {...form.getInputProps("justification")}
                radius="lg"
                size="md"
                styles={{
                  input: {
                    borderColor: "var(--secondary-300)",
                    "&:focus": {
                      borderColor: "var(--primary-500)",
                      boxShadow: "0 0 0 3px var(--primary-100)",
                    },
                  },
                }}
              />

              <Button
                type="submit"
                size="lg"
                fullWidth
                leftSection={<IconClipboard />}
                className="modern-btn modern-btn-primary"
                styles={{
                  root: {
                    background:
                      "linear-gradient(135deg, var(--military-green) 0%, var(--military-dark) 100%)",
                    color: "white",
                    fontWeight: 600,
                    fontSize: "1rem",
                    padding: "var(--space-md) var(--space-xl)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, var(--military-dark) 0%, var(--primary-800) 100%)",
                      transform: "translateY(-1px)",
                      boxShadow: "var(--shadow-md)",
                    },
                  },
                }}
              >
                שלח בקשה
              </Button>
            </Stack>
          </form>
        </div>
      </div>
    </div>
  );
});

export { FormPage };
