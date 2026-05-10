'use client';

import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import styles from './chip-picker.module.scss';

export interface ChipPickerOption<T extends string = string> {
  value: T;
  label?: string;
}

interface ChipPickerProps<T extends string> {
  options: ReadonlyArray<T | ChipPickerOption<T>>;
  selected: ReadonlyArray<T>;
  onToggle: (value: T) => void;
  onClear?: () => void;
  className?: string;
  ariaLabel?: string;
}

export const ChipPicker = <T extends string>({
  options,
  selected,
  onToggle,
  onClear,
  className,
  ariaLabel,
}: ChipPickerProps<T>) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateScrollState = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollPrev(el.scrollLeft > 0);
    setCanScrollNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    updateScrollState();
    const el = trackRef.current;
    if (!el) return;
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    return () => ro.disconnect();
  }, [options]);

  const scrollByChips = (dir: 1 | -1, count = 2) => {
    const el = trackRef.current;
    if (!el) return;
    const chips = el.querySelectorAll<HTMLElement>(`.${styles.chip}`);
    if (chips.length === 0) return;

    const styleEl = getComputedStyle(el);
    const gap = parseFloat(styleEl.columnGap || styleEl.gap || '0') || 0;

    // Average chip width (chips can have variable widths)
    let total = 0;
    chips.forEach((c) => (total += c.offsetWidth));
    const avgChipWidth = total / chips.length;

    const distance = (avgChipWidth + gap) * count;
    el.scrollBy({ left: dir * distance, behavior: 'smooth' });
  };

  return (
    <div className={`${styles.wrapper} ${className ?? ''}`}>
      <button
        type='button'
        className={styles.navBtn}
        onClick={() => scrollByChips(-1)}
        disabled={!canScrollPrev}
        aria-label='Scroll left'
        tabIndex={-1}
      >
        <ChevronLeft size={16} />
      </button>

      <div
        ref={trackRef}
        className={styles.chipPicker}
        role='group'
        aria-label={ariaLabel}
        onScroll={updateScrollState}
      >
        {options.map((opt) => {
          const value = typeof opt === 'string' ? opt : opt.value;
          const label = typeof opt === 'string' ? opt : (opt.label ?? opt.value);
          const active = selected.includes(value);
          return (
            <button
              key={value}
              type='button'
              aria-pressed={active}
              className={`${styles.chip} ${active ? styles.chipActive : ''}`}
              onClick={() => onToggle(value)}
            >
              {label}
            </button>
          );
        })}
      </div>

      <button
        type='button'
        className={styles.navBtn}
        onClick={() => scrollByChips(1)}
        disabled={!canScrollNext}
        aria-label='Scroll right'
        tabIndex={-1}
      >
        <ChevronRight size={16} />
      </button>

      {onClear && (
        <button
          type='button'
          className={styles.clearBtn}
          onClick={onClear}
          disabled={selected.length === 0}
          aria-label='Clear selection'
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};
