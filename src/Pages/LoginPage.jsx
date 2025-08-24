import {
  Anchor,
  Button,
  Flex,
  Divider,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Popover,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useToggle } from "@mantine/hooks";
import { observer } from "mobx-react-lite";
import { authProvider } from "../../AuthProvider/AuthProvider";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from '../images/Armme.jpeg';


const LoginPage = observer(() => {

  const [opened, setOpened] = useState(false);
  const [logoSize, setLogoSize] = useState(200);

  const navigate = useNavigate();
  const [type, toggle] = useToggle(["login", "register"]);

  const form = useForm({
    initialValues: {
      userName: "",
      name: "",
      password: "",
      unitNumber: "",
      role: "",
      location: "",
    },
    validate: {
      userName: (val) =>
        val.length < 6 ? "שם משתמש חייב להיות מעל 6 תווים" : null,
      password: (val) =>
        val.length < 6 ? "סיסמה חייבת להיות מעל 6 תווים" : null,
    },
  });

  const handleSubmit = async (values) => {
    if (type === "login") {
      const user = await authProvider.handleSignIn(
        values.userName,
        values.password
      );

      if (user) {
        if (user.role === "Admin") navigate("/home-admin");
        else navigate("/home-user");
        setLogoSize(200);
      } else {
        alert("שם משתמש או סיסמה שגויים");
      }
    } else {
      const success = await authProvider.handleSignUp(
        values.userName,
        values.password,
        values.name,
        values.unitNumber,
        values.role,
        values.location
      );

      if (success) {
        alert("הרשמה בוצעה בהצלחה! התחבר עכשיו");
        toggle();
        setLogoSize(200);
      } else {
        alert("שגיאה בהרשמה");
      }
    }
  };

  return (
    <Flex justify="center" align="center" style={{ minHeight: "100vh" }}>
      <Paper
        radius="xl"
        shadow="xl"
        p="xl"
        withBorder
        style={{ width: "100%", maxWidth: 420 ,  backgroundColor: "#e6d7ba"}}
        dir="rtl"
        w={420}
      
      >
        <Stack align="center" mb="md" gap={4}>
      <Popover
        width={300}
        position="bottom"
        withArrow
        shadow="md"
        opened={opened}
      >
        <Popover.Target>
          <img
            src= {logo} 
            alt="חמש אותי"
            style={{ width: logoSize, cursor: "pointer", transition: "width 0.3s ease" }}
            onMouseEnter={() => setOpened(true)}
            onMouseLeave={() => setOpened(false)}
          />
        </Popover.Target>
        <Popover.Dropdown
          dir="rtl"
          onMouseEnter={() => setOpened(true)}
          onMouseLeave={() => setOpened(false)}
          style={{ lineHeight: 1.6 }}
        >
          <Text style={{ fontWeight: 900 }} size="md" c="#333" mb={4}>
            ניהול תחמשות בצה"ל ב-5 שלבים:
          </Text>
          <ol style={{ paddingRight: 20, 
          marginTop: 8 ,
          color: "#555",
          fontSize: 14,
          lineHeight: 1.8,
          }}>
            <li style={{ marginBottom: 6 }}>הרשמה</li>
            <li style={{ marginBottom: 6 }}>התחברות</li>
            <li style={{ marginBottom: 6 }}>דו"ח מלאי</li>
            <li style={{ marginBottom: 6 }}>בקשות ממתינות</li>
            <li>הגשת בקשה חדשה</li>
          </ol>
        </Popover.Dropdown>
      </Popover>

      <Text size="sm" c="black" style={{ fontWeight: 'bold' }}>
        מערכת צה"ל לניהול מלאי
      </Text>
    </Stack>

        <Divider
          label={type === "login" ? "התחברות" : "הרשמה"}
          labelPosition="center"
          my="lg"
          color="black"
          styles={{
          label: { color: 'black', fontWeight: 600 }
  }}
        />

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              required
              label="שם משתמש או מספר אישי"
              placeholder="הכנס שם משתמש או מספר אישי"
              value={form.values.userName}
              onChange={(e) =>
                form.setFieldValue("userName", e.currentTarget.value)
              }
              error={form.errors.userName}
              radius="md"
            />

            <PasswordInput
              required
              label="סיסמה"
              placeholder="הכנס סיסמה"
              value={form.values.password}
              onChange={(e) =>
                form.setFieldValue("password", e.currentTarget.value)
              }
              error={form.errors.password}
              radius="md"
            />

            {type === "register" && (
              <>
                <TextInput
                  label="שמך"
                  placeholder="השם שלך"
                  value={form.values.name}
                  onChange={(e) =>
                    form.setFieldValue("name", e.currentTarget.value)
                  }
                  radius="md"
                />
                <TextInput
                  label="מספר יחידה"
                  placeholder="הכנס מספר יחידה"
                  value={form.values.unitNumber}
                  onChange={(e) =>
                    form.setFieldValue("unitNumber", e.currentTarget.value)
                  }
                  radius="md"
                />
                <TextInput
                  label="תפקיד"
                  placeholder="הכנס תפקיד"
                  value={form.values.role}
                  onChange={(e) =>
                    form.setFieldValue("role", e.currentTarget.value)
                  }
                  radius="md"
                />
                <TextInput
                  label="מיקום"
                  placeholder="הכנס מיקום"
                  value={form.values.location}
                  onChange={(e) =>
                    form.setFieldValue("location", e.currentTarget.value)
                  }
                  radius="md"
                />
              </>
            )}
          </Stack>

          <Group justify="space-between" mt="xl">
            <Anchor
              component="button"
              type="button"
              c="black"
              size="sm"
              onClick={() => {
              toggle();
              setLogoSize(type === "login" ? 80 : 200);
            }}
            >
              {type === "register"
                ? "כבר יש לך משתמש? התחבר"
                : "אין לך חשבון? הרשם"}
            </Anchor>

            <Button type="submit" radius="xl" size="md" styles={(theme) => ({
    root: {
      backgroundColor: "rgb(62, 68, 32)",
      color: "white",
      "&:hover": {
        backgroundColor: "rgb(50, 55, 28)",
      },
    },
  })}>
              {type === "register" ? "הרשמה" : "התחבר"}
            </Button>
          </Group>
        </form>
      </Paper>
    </Flex>
  );
});

export { LoginPage };
