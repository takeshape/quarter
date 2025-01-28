import { Button, Alert, Input } from "@heroui/react";
import React, { useCallback, useState } from "react";
import { Form } from "@remix-run/react";
import { useSettingsStore } from "../store.ts";

const SIMPLE_EMAIL_REGEX = /^\S+@\S+\.\S+$/;

export default function About() { 
  const [error, setError] = useState<null | string>(null);
  const [success, setSuccess] = useState<null | string>(null);
  const email = useSettingsStore(state => state.email);
  const setEmail = useSettingsStore(state => state.setEmail);
  const [emailFormValue, setEmailFormValue] = useState(email);

  const saveSettings: React.FormEventHandler<HTMLFormElement> = useCallback((e) => {
    if (emailFormValue !== '' && !SIMPLE_EMAIL_REGEX.test(emailFormValue)) {
      setError(`"${emailFormValue}" is not a valid email address`);
      setSuccess(null);
    } else {
      setEmail(emailFormValue);
      setError(null);
      setSuccess(`Email updated to "${emailFormValue}"`);
    }
  }, [emailFormValue]);

  return (
    <div className="mx-auto px-4 max-w-2xl">
      <p className="text-xl mb-4">Settings</p>
      {success && <Alert color="success" className="mb-4" description={success} title="Success" />}
      {error && <Alert color="danger" className="mb-4" description={error} title="Error" />}
      <Form className="w-full" onSubmit={saveSettings}>
        <Input
          name="email"
          size="lg"
          fullWidth
          placeholder="Email"
          value={emailFormValue}
          classNames={{
            inputWrapper: "pr-0"
          }}
          onChange={(e) => setEmailFormValue(e.target.value)}
        />
        <Button
          type="submit"
          aria-label="Save"
          className="mt-4"
        >
          Save
        </Button>
      </Form>
    </div>
  );
}
