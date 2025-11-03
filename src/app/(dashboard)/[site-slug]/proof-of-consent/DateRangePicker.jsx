'use client'

import 'react-day-picker/style.css';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';

export function DateRangePicker({ range, onRangeChange }) {
  return (
    <div className="proof-of-consent__calendar-popover" onClick={(e) => e.stopPropagation()}>
      <DayPicker
        mode="range"
        numberOfMonths={1}
        selected={range}
        onSelect={(nextRange, selectedDay) => {
          if (range?.from && range?.to && nextRange?.from && !nextRange?.to) {
            onRangeChange({ from: selectedDay, to: selectedDay });
            return;
          }
          onRangeChange(nextRange);
        }}
        max={7}
        captionLayout="dropdown"
        navLayout="around"
        locale={enUS}
        formatters={{
          formatMonthDropdown: (month, options) => format(month, 'LLL', { locale: options?.locale }),
        }}
        showOutsideDays={true}
        weekStartsOn={1}
      />
    </div>
  );
}

