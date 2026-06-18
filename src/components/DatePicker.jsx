import React, { useEffect, useRef, useState } from "react";
import { formatDate, formatDisplayDate } from "../utils/helper";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const toDateValue = (value) => {
  if (!value) return null;
  const parsed = formatDate(value);
  if (!parsed) return null;
  const [year, month, day] = parsed.split("-").map(Number);
  return new Date(year, month - 1, day);
};

export default function DatePicker({
  value,
  onChange,
  label,
  placeholder = "Select date",
  minDate,
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => toDateValue(value) || new Date());
  const containerRef = useRef(null);

  const selectedDate = toDateValue(value);
  const minDateValue = toDateValue(minDate);
  const today = formatDate(new Date());

  useEffect(() => {
    if (value) {
      const parsed = toDateValue(value);
      if (parsed) setViewDate(parsed);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays = [];
  for (let i = 0; i < firstDay; i += 1) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    calendarDays.push(day);
  }

  const isDisabled = (day) => {
    if (!day) return true;
    if (!minDateValue) return false;
    const candidate = new Date(year, month, day);
    return candidate < minDateValue;
  };

  const handleSelect = (day) => {
    if (isDisabled(day)) return;
    const nextValue = formatDate(new Date(year, month, day));
    onChange(nextValue);
    setOpen(false);
  };

  const goToMonth = (offset) => {
    setViewDate(new Date(year, month + offset, 1));
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {label && (
        <label className="block text-xs font-medium text-gray-500 mb-1">
          {label}
        </label>
      )}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between gap-2 border border-gray-200 bg-white px-3 py-2.5 rounded-xl text-left shadow-sm hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
      >
        <span className={value ? "text-gray-800" : "text-gray-400"}>
          {value ? formatDisplayDate(value) : placeholder}
        </span>
        <span className="text-blue-600 shrink-0">
          <CalendarIcon />
        </span>
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full min-w-[280px] rounded-2xl border border-gray-100 bg-white p-4 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => goToMonth(-1)}
              className="h-8 w-8 rounded-lg text-gray-500 hover:bg-gray-100"
              aria-label="Previous month"
            >
              ‹
            </button>

            <div className="text-sm font-semibold text-gray-800">
              {MONTHS[month]} {year}
            </div>

            <button
              type="button"
              onClick={() => goToMonth(1)}
              className="h-8 w-8 rounded-lg text-gray-500 hover:bg-gray-100"
              aria-label="Next month"
            >
              ›
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {WEEKDAYS.map((day) => (
              <div
                key={day}
                className="text-center text-[11px] font-semibold uppercase tracking-wide text-gray-400 py-1"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => {
              if (!day) {
                return <div key={`empty-${index}`} />;
              }

              const dayValue = formatDate(new Date(year, month, day));
              const isSelected = value === dayValue;
              const isToday = today === dayValue;
              const disabled = isDisabled(day);

              return (
                <button
                  key={dayValue}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleSelect(day)}
                  className={[
                    "h-9 rounded-xl text-sm font-medium transition",
                    disabled && "cursor-not-allowed text-gray-300",
                    !disabled && !isSelected && "text-gray-700 hover:bg-blue-50",
                    isToday && !isSelected && "ring-1 ring-blue-200",
                    isSelected && "bg-blue-600 text-white shadow-sm",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {day}
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
            <button
              type="button"
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
              className="text-xs font-medium text-gray-500 hover:text-gray-700"
            >
              Clear
            </button>

            <button
              type="button"
              onClick={() => {
                onChange(today);
                setViewDate(new Date());
                setOpen(false);
              }}
              className="text-xs font-medium text-blue-600 hover:text-blue-700"
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function CalendarIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}
