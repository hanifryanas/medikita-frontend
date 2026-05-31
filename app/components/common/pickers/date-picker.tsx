'use client';

import { format, isValid, parse } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';
import styles from './date-picker.module.scss';

const ISO_FORMAT = 'yyyy-MM-dd';
const DISPLAY_FORMAT = 'dd MMM yyyy';

const parseISO = (value: string | undefined): Date | undefined => {
  if (!value) return undefined;
  const parsed = parse(value, ISO_FORMAT, new Date());
  return isValid(parsed) ? parsed : undefined;
};

interface DatePickerProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  hasError?: boolean;
  fromYear?: number;
  toYear?: number;
  ariaLabel?: string;
  className?: string;
}

export const DatePicker = ({
  id,
  value,
  onChange,
  placeholder = 'Select date',
  disabled = false,
  hasError = false,
  fromYear = 1900,
  toYear = new Date().getFullYear(),
  ariaLabel,
  className,
}: DatePickerProps) => {
  const autoId = useId();
  const triggerId = id ?? autoId;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const selected = parseISO(value);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={wrapperRef} className={`${styles.wrapper} ${className ?? ''}`}>
      <button
        id={triggerId}
        type='button'
        disabled={disabled}
        aria-label={ariaLabel}
        aria-haspopup='dialog'
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className={`${styles.trigger} ${open ? styles.open : ''} ${
          hasError ? styles.triggerError : ''
        }`}
      >
        <span className={selected ? '' : styles.placeholder}>
          {selected ? format(selected, DISPLAY_FORMAT) : placeholder}
        </span>
        <CalendarIcon size={16} className={styles.icon} aria-hidden='true' />
      </button>

      {open && (
        <div className={styles.popover} role='dialog'>
          <DayPicker
            mode='single'
            selected={selected}
            defaultMonth={selected ?? new Date(toYear, 0, 1)}
            captionLayout='dropdown'
            startMonth={new Date(fromYear, 0)}
            endMonth={new Date(toYear, 11)}
            disabled={{ after: new Date(toYear, 11, 31) }}
            onSelect={(date) => {
              if (date) {
                onChange(format(date, ISO_FORMAT));
                setOpen(false);
              }
            }}
            className={styles.calendar}
          />
        </div>
      )}
    </div>
  );
};
