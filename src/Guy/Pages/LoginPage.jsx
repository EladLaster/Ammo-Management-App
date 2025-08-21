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
    },

    validate: {
      userName: (val) => (val.length <= 6 ? 'Invalid userName, should include at least 6 characters' : null),
      password: (val) => (val.length <= 6 ? 'Password should include at least 6 characters' : null),
    },
  });

  return (
        <Paper radius="md" p="lg"  withBorder style={{ width: 400, maxWidth: '90vw', background: '#222' }}>
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
        authProvider.handleSignUp(form.values.userName, form.values.password)        
    
      })}>
        <Stack>
        <div dir="rtl">

          {type === 'register' && (
            <TextInput
              label="שמך"
              placeholder="השם שלך"
              value={form.values.name}
              onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
              radius="md"
            />
          )}
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
            onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
            error={form.errors.password && 'Password should include at least 6 characters'}
            radius="md"
            mb="md"
          />
        
          {type === 'register' && (
            <Checkbox
              label="I accept terms and conditions"
              checked={form.values.terms}
              onChange={(event) => form.setFieldValue('terms', event.currentTarget.checked)}
            />
          )}
          </div>
        </Stack>

        <Group justify="space-between" mt="xl">
          <Anchor component="button" type="button" c="dimmed" onClick={() => toggle()} size="xs">
            {type === 'register'
              ? 'כבר יש לך משתמש ? התחבר'
              : "אין לך חשבון ? הרשם"}
          </Anchor>
          <Button text="התחבר" type="submit" radius="xl">
              {type === 'register' ? 'Register' : 'התחבר'}
          </Button>
        </Group>
      </form>
    </Paper>
  );
})

export {LoginPage};
