'use client';

import * as React from 'react';
import type { LumenSize } from './appearance';
import { LumenButton, LumenIconButton, LumenText } from './primitives';
import './forms.css';

export type LumenFieldVariant = 'outlined' | 'plain';

export interface LumenControlOption {
  id: string;
  label: string;
  detail?: string | undefined;
  disabled?: boolean | undefined;
}

export interface LumenFormFieldProps {
  controlId: string;
  label: string;
  description?: string | undefined;
  hint?: string | undefined;
  error?: string | undefined;
  required?: boolean | undefined;
  requiredIndicator?: string | undefined;
  size?: LumenSize | undefined;
  children: React.ReactNode;
  className?: string | undefined;
}

export function LumenFormField({
  controlId,
  label,
  description,
  hint,
  error,
  required,
  requiredIndicator,
  size,
  children,
  className,
}: LumenFormFieldProps) {
  const descriptionId = description ? `${controlId}-description` : undefined;
  let messageId: string | undefined;
  if (error) {
    messageId = `${controlId}-error`;
  } else if (hint) {
    messageId = `${controlId}-hint`;
  }
  const describedBy = [descriptionId, messageId].filter(Boolean).join(' ') || undefined;
  const control = React.isValidElement<Record<string, unknown>>(children)
    ? React.cloneElement(children, {
        id: children.props.id ?? controlId,
        required: children.props.required ?? required,
        'aria-describedby': children.props['aria-describedby'] ?? describedBy,
        'aria-invalid': children.props['aria-invalid'] ?? (Boolean(error) || undefined),
        'data-size': children.props['data-size'] ?? size,
      })
    : children;

  let message: React.ReactNode;
  if (error) {
    message = (
      <LumenText as="small" id={messageId} tone="danger" variant="supporting" size={size}>
        {error}
      </LumenText>
    );
  } else if (hint) {
    message = (
      <LumenText as="small" id={messageId} tone="muted" variant="supporting" size={size}>
        {hint}
      </LumenText>
    );
  }

  return (
    <div
      className={['lumen-form-field', className].filter(Boolean).join(' ')}
      data-invalid={Boolean(error) || undefined}
    >
      <label htmlFor={controlId}>
        <LumenText as="span" variant="label" size={size}>
          {label}
        </LumenText>
        {required && requiredIndicator ? (
          <LumenText as="span" tone="danger" aria-hidden="true">
            {requiredIndicator}
          </LumenText>
        ) : null}
      </label>
      {description ? (
        <LumenText as="p" id={descriptionId} tone="muted" variant="supporting" size={size}>
          {description}
        </LumenText>
      ) : null}
      {control}
      {message}
    </div>
  );
}

interface LumenControlProps {
  size?: LumenSize | undefined;
  variant?: LumenFieldVariant | undefined;
}

export interface LumenInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>, LumenControlProps {}

export interface LumenTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>, LumenControlProps {}

export interface LumenSelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'>, LumenControlProps {}

function controlClass(className: string | undefined): string {
  return ['lumen-control', className].filter(Boolean).join(' ');
}

export const LumenInput = React.forwardRef<HTMLInputElement, LumenInputProps>(function LumenInput(
  { className, size, variant = 'outlined', ...other },
  ref,
) {
  return (
    <input
      {...other}
      ref={ref}
      className={controlClass(className)}
      data-size={size}
      data-variant={variant}
    />
  );
});

export const LumenTextarea = React.forwardRef<HTMLTextAreaElement, LumenTextareaProps>(
  function LumenTextarea({ className, size, variant = 'outlined', ...other }, ref) {
    return (
      <textarea
        {...other}
        ref={ref}
        className={controlClass(className)}
        data-size={size}
        data-variant={variant}
      />
    );
  },
);

export const LumenSelect = React.forwardRef<HTMLSelectElement, LumenSelectProps>(
  function LumenSelect({ className, children, size, variant = 'outlined', ...other }, ref) {
    return (
      <select
        {...other}
        ref={ref}
        className={controlClass(className)}
        data-size={size}
        data-variant={variant}
      >
        {children}
      </select>
    );
  },
);

export interface LumenCheckBoxControlProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type' | 'size'
> {
  size?: LumenSize | undefined;
}

export const LumenCheckBoxControl = React.forwardRef<HTMLInputElement, LumenCheckBoxControlProps>(
  function LumenCheckBoxControl({ size, className, ...other }, ref) {
    return (
      <input
        {...other}
        ref={ref}
        type="checkbox"
        className={['lumen-checkbox-control', className].filter(Boolean).join(' ')}
        data-size={size}
      />
    );
  },
);

export interface LumenCheckBoxProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type' | 'children' | 'size'
> {
  label: string;
  description?: string | undefined;
  size?: LumenSize | undefined;
}

export const LumenCheckBox = React.forwardRef<HTMLInputElement, LumenCheckBoxProps>(
  function LumenCheckBox({ label, description, size, className, ...other }, ref) {
    return (
      <label className={['lumen-checkbox', className].filter(Boolean).join(' ')}>
        <LumenCheckBoxControl {...other} ref={ref} size={size} />
        <span className="lumen-checkbox-copy">
          <LumenText as="span" variant="label" size={size}>
            {label}
          </LumenText>
          {description ? (
            <LumenText as="small" tone="muted" variant="supporting" size={size}>
              {description}
            </LumenText>
          ) : null}
        </span>
      </label>
    );
  },
);

export interface LumenComboBoxLabels {
  open: string;
  empty: string;
  loading: string;
}

export interface LumenComboBoxProps {
  id: string;
  value: string | null;
  query: string;
  open: boolean;
  options: readonly LumenControlOption[];
  labels: LumenComboBoxLabels;
  placeholder?: string | undefined;
  size?: LumenSize | undefined;
  variant?: LumenFieldVariant | undefined;
  disabled?: boolean | undefined;
  loading?: boolean | undefined;
  invalid?: boolean | undefined;
  describedBy?: string | undefined;
  loadMoreLabel?: string | undefined;
  onLoadMore?: (() => void) | undefined;
  onQueryChange: (query: string) => void;
  onOpenChange: (open: boolean) => void;
  onValueChange: (value: string) => void;
}

function uniqueOptions(options: readonly LumenControlOption[]): readonly LumenControlOption[] {
  const seen = new Set<string>();
  return options.filter((option) => {
    if (seen.has(option.id)) {
      return false;
    }
    seen.add(option.id);
    return true;
  });
}

function FormGlyph({ name }: { name: 'check' | 'chevron' | 'close' }) {
  return (
    <svg className="lumen-form-glyph" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      {name === 'check' ? <path d="m3.5 8 3 3 6-6" /> : null}
      {name === 'chevron' ? <path d="m4 6 4 4 4-4" /> : null}
      {name === 'close' ? <path d="m4 4 8 8m0-8-8 8" /> : null}
    </svg>
  );
}

export function LumenComboBox({
  id,
  value,
  query,
  open,
  options,
  labels,
  placeholder,
  size,
  variant = 'outlined',
  disabled = false,
  loading = false,
  invalid = false,
  describedBy,
  loadMoreLabel,
  onLoadMore,
  onQueryChange,
  onOpenChange,
  onValueChange,
}: LumenComboBoxProps) {
  const items = uniqueOptions(options);
  const available = items.filter((option) => !option.disabled);
  const select = (option: LumenControlOption) => {
    if (option.disabled) {
      return;
    }
    onQueryChange(option.label);
    onValueChange(option.id);
    onOpenChange(false);
  };
  const move = (direction: 1 | -1) => {
    if (available.length === 0) {
      return;
    }
    const current = available.findIndex((option) => option.id === value);
    let next = (current + direction + available.length) % available.length;
    if (current < 0) {
      next = direction > 0 ? 0 : available.length - 1;
    }
    select(available[next]!);
  };
  let optionContent: React.ReactNode;
  if (loading) {
    optionContent = (
      <LumenText as="p" tone="muted" variant="supporting">
        {labels.loading}
      </LumenText>
    );
  } else if (items.length === 0) {
    optionContent = (
      <LumenText as="p" tone="muted" variant="supporting">
        {labels.empty}
      </LumenText>
    );
  } else {
    optionContent = items.map((option) => (
      <LumenButton
        key={option.id}
        role="option"
        aria-selected={value === option.id}
        disabled={option.disabled}
        className="lumen-combobox-option"
        variant="text"
        size={size}
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => select(option)}
      >
        <span>
          <LumenText as="strong" variant="label">
            {option.label}
          </LumenText>
          {option.detail ? (
            <LumenText as="small" tone="muted" variant="supporting">
              {option.detail}
            </LumenText>
          ) : null}
        </span>
        {value === option.id ? <FormGlyph name="check" /> : null}
      </LumenButton>
    ));
  }

  return (
    <div
      className="lumen-combobox"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          onOpenChange(false);
        }
      }}
    >
      <div
        className="lumen-combobox-control"
        data-size={size}
        data-variant={variant}
        data-invalid={invalid || undefined}
      >
        <LumenInput
          id={id}
          type="text"
          role="combobox"
          value={query}
          placeholder={placeholder}
          disabled={disabled}
          size={size}
          variant="plain"
          aria-expanded={open}
          aria-controls={`${id}-listbox`}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          onFocus={() => onOpenChange(true)}
          onChange={(event) => {
            onQueryChange(event.currentTarget.value);
            onOpenChange(true);
          }}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
              event.preventDefault();
              onOpenChange(true);
              move(event.key === 'ArrowDown' ? 1 : -1);
            } else if (event.key === 'Escape') {
              event.preventDefault();
              onOpenChange(false);
            }
          }}
        />
        <LumenIconButton
          className="lumen-combobox-toggle"
          label={labels.open}
          size={size}
          disabled={disabled}
          aria-expanded={open}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => onOpenChange(!open)}
        >
          <FormGlyph name="chevron" />
        </LumenIconButton>
      </div>
      {open && !disabled ? (
        <div className="lumen-combobox-popup hbar-app-ui-dialog-menu">
          <div id={`${id}-listbox`} role="listbox">
            {optionContent}
          </div>
          {loadMoreLabel && onLoadMore ? (
            <LumenButton
              className="lumen-combobox-load-more"
              variant="text"
              size={size}
              onClick={onLoadMore}
            >
              {loadMoreLabel}
            </LumenButton>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export interface LumenMultiSelectLabels extends LumenComboBoxLabels {
  remove: (label: string) => string;
}

export interface LumenMultiSelectProps extends Omit<
  LumenComboBoxProps,
  'value' | 'options' | 'labels' | 'onValueChange'
> {
  values: readonly string[];
  options: readonly LumenControlOption[];
  labels: LumenMultiSelectLabels;
  onValuesChange: (values: readonly string[]) => void;
}

export function LumenMultiSelect({
  values,
  options,
  labels,
  disabled,
  size,
  onValuesChange,
  ...comboBox
}: LumenMultiSelectProps) {
  const uniqueOptionItems = uniqueOptions(options);
  const uniqueValues = [...new Set(values)];
  const selected = uniqueValues.map(
    (value) =>
      uniqueOptionItems.find((option) => option.id === value) ?? { id: value, label: value },
  );
  const available = uniqueOptionItems.filter((option) => !uniqueValues.includes(option.id));

  return (
    <div className="lumen-multi-select" data-size={size} data-disabled={disabled || undefined}>
      {selected.length > 0 ? (
        <div className="lumen-multi-select-values">
          {selected.map((option) => (
            <span key={option.id}>
              <LumenText as="span">{option.label}</LumenText>
              <LumenIconButton
                label={labels.remove(option.label)}
                size={size}
                disabled={disabled}
                onClick={() => onValuesChange(uniqueValues.filter((value) => value !== option.id))}
              >
                <FormGlyph name="close" />
              </LumenIconButton>
            </span>
          ))}
        </div>
      ) : null}
      <LumenComboBox
        {...comboBox}
        value={null}
        options={available}
        labels={labels}
        size={size}
        disabled={disabled}
        onValueChange={(value) => onValuesChange([...uniqueValues, value])}
      />
    </div>
  );
}
