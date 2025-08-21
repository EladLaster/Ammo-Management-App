import {
  Anchor,
  Button,
  Flex,
  Checkbox,
  Divider,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { upperFirst, useToggle } from '@mantine/hooks';
import {observer} from 'mobx-react-lite'
import {authProvider} from '../../../AuthProvider/AuthProvider'

const LoginPage = observer(() =>
{
  const [type, toggle] = useToggle(['login', 'register']);
  const form = useForm({
    initialValues: {
      userName: '',
      name: '',
      password: '',
      terms: false,
      unitNumber: '',
      role: '',
      location: '',
    },

    validate: {
      userName: (val) => (val.length <= 6 ? 'Invalid userName, should include at least 6 characters' : null),
      password: (val) => (val.length <= 6 ? 'Password should include at least 6 characters' : null),
      // אפשר להוסיף ולידציה לשדות החדשים אם תרצה
    },
  });

  return (
    <Paper
      radius="md"
      p="lg"
      withBorder
      style={{ width: 420, maxWidth: "98vw", background: "#222" }} // הגדלתי מעט את הרוחב
    >
      <Flex direction="column" align="center" justify="center" mb="md">
        <Text size="lg" fw={500}>
          ניהול תחמושת
        </Text>
        <Text size="sm" fw={300}>
          מערכת צה"ל לניהול מלאי
        </Text>
      </Flex>

      <Divider label={`Enter ${type} information`} labelPosition="center" my="lg" />

      <form onSubmit={form.onSubmit(() => {
        if(type === 'login') authProvider.handleSignIn(form.values.userName, form.values.password)        
        else authProvider.handleSignUp(
          form.values.userName,
          form.values.password,
          form.values.name,
          form.values.unitNumber,
          form.values.role,
          form.values.location
        )
      })}>
        <Stack>
          <div dir="rtl">
            <TextInput
              required
              label="שם משתמש או מספר אישי"
              placeholder="הכנס שם משתמש או מספר אישי"
              value={form.values.userName}
              onChange={(event) => form.setFieldValue('userName', event.currentTarget.value)}
              error={form.errors.userName && 'Invalid userName'}
              radius="md"
              style={{ width: '100%' }}
            />

            <PasswordInput
              required
              label="סיסמה"
              placeholder="הכנס סיסמה"
              value={form.values.password}
              onChange={(event) =>
                form.setFieldValue("password", event.currentTarget.value)
              }
              error={
                form.errors.password &&
                "Password should include at least 6 characters"
              }
              radius="md"
              style={{ width: '100%' }}
            />

            {type === 'register' && (
              <>
                <TextInput
                  label="שמך"
                  placeholder="השם שלך"
                  value={form.values.name}
                  onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
                  radius="md"
                  style={{ width: '100%' }}
                />
                <TextInput
                  label="מספר יחידה"
                  placeholder="הכנס מספר יחידה"
                  value={form.values.unitNumber}
                  onChange={(event) => form.setFieldValue('unitNumber', event.currentTarget.value)}
                  radius="md"
                  style={{ width: '100%' }}
                />
                <TextInput
                  label="תפקיד"
                  placeholder="הכנס תפקיד"
                  value={form.values.role}
                  onChange={(event) => form.setFieldValue('role', event.currentTarget.value)}
                  radius="md"
                  style={{ width: '100%' }}
                />
                <TextInput
                  label="מיקום"
                  placeholder="הכנס מיקום"
                  value={form.values.location}
                  onChange={(event) => form.setFieldValue('location', event.currentTarget.value)}
                  radius="md"
                  style={{ width: '100%' }}
                />
              </>
            )}

          </div>
        </Stack>

        <Group justify="space-between" mt="xl">
          <Anchor
            component="button"
            type="button"
            c="dimmed"
            onClick={() => toggle()}
            size="xs"
          >
            {type === "register"
              ? "כבר יש לך משתמש ? התחבר"
              : "אין לך חשבון ? הרשם"}
          </Anchor>
          <Button type="submit" radius="xl">
            {type === "register" ? "Register" : "התחבר"}
          </Button>
        </Group>
      </form>
    </Paper>
  );
})
export {LoginPage};
