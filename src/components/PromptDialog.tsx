"use client";

import { useEffect, useId, useState } from "react";
import { Button } from "./Button";
import { Dialog } from "./Dialog";
import { Field, Input } from "./Field";
import { useLabels } from "./Provider";
import { useToast } from "./Toast";

/**
 * Diálogo de un solo campo de texto ("Renombrar…", "Nuevo nombre"). No conoce
 * la entidad: el consumidor pasa `onSave`. Si `onSave` falla, el diálogo queda
 * abierto con lo escrito y muestra el error.
 */
export function PromptDialog({
  open,
  onClose,
  title,
  label,
  initialValue,
  maxLength,
  saveLabel,
  successMessage,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  label: string;
  initialValue: string;
  maxLength?: number;
  saveLabel?: string;
  /** Toast de éxito (por defecto "Nombre actualizado"; `null` = sin toast). */
  successMessage?: string | null;
  onSave: (value: string) => Promise<void>;
}) {
  const [value, setValue] = useState(initialValue);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();
  const labels = useLabels();
  const id = useId();

  useEffect(() => {
    if (open) {
      setValue(initialValue);
      setError("");
      setSaving(false);
    }
  }, [open, initialValue]);

  const save = async () => {
    if (!value.trim()) return;
    setSaving(true);
    setError("");
    try {
      await onSave(value.trim());
      if (successMessage !== null) toast(successMessage ?? "Nombre actualizado", "success");
      onClose();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button onClick={onClose} disabled={saving}>
            {labels.cancel}
          </Button>
          <Button variant="primary" loading={saving} disabled={!value.trim()} onClick={() => void save()}>
            {saveLabel ?? labels.save}
          </Button>
        </>
      }
    >
      <Field label={label} id={id} error={error || undefined} charCount={maxLength ? { length: value.length, max: maxLength } : undefined}>
        <Input
          autoFocus
          value={value}
          maxLength={maxLength}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && void save()}
        />
      </Field>
    </Dialog>
  );
}

/** Alias de compatibilidad con genwork. */
export function RenameDialog(props: {
  open: boolean;
  onClose: () => void;
  title: string;
  label: string;
  initialName: string;
  maxLength?: number;
  onSave: (name: string) => Promise<void>;
}) {
  const { initialName, ...rest } = props;
  return <PromptDialog {...rest} initialValue={initialName} />;
}
