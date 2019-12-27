/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from 'react';

import momentTimezone from 'moment-timezone';

import classnames from 'classnames';

import { BaseField, MaskedInput } from 'pipestyle';

import keyCodes from 'pipestyle/lib/utils/keyCodes';

import regex from 'pipestyle/lib/utils/regex';

import moment from 'pipestyle/lib/utils/moment';

import TimePickerDropdown from './TimePickerDropdown';

import formatTime from './utils/formatTime';

import 'pipestyle/lib/utils/moment-locales';

export function getTimes(_ref) {
  const { start, end, interval, locale, timeZone } = _ref;

  momentTimezone.locale(moment(locale));

  momentTimezone.tz.setDefault(timeZone);

  const times = [];
  let time = start;

  do {
    times.push(time);
    time = momentTimezone(time).add(interval, 'minutes');
  } while (time < end);

  return times;
}

function usePrevious(value) {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef();

  // Store current value in ref
  useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes

  // Return previous value (happens before update in useEffect above)
  return ref.current;
}

export default function TimePicker(props) {
  const {
    value = undefined,
    timeZone = '',
    locale = 'enUS',
    onChange = function onChange() {},
    shouldClearDateTime = true,
    interval = 30,
    inputSize = 'sm',
    timeMask = {
      mask: null,
      9: '[0-9]',
      A: '[a|p|A|P]'
    },
    label,
    className
  } = props;

  const { mask } = timeMask;
  const classes = classnames(className, {
    'col-md-6 pp-no-padding': !className
  });

  function getMask() {
    if (mask) return mask;
    const enUsFormatMask = '12:34 AM';
    const otherFormatMask = '12:34';
    return ['enUS'].includes(locale) ? enUsFormatMask : otherFormatMask;
  }

  function getTimeAndDate() {
    const currentTime = value
      ? formatTime(value, timeZone, locale, getMask())
      : '';
    const currentDate = value || undefined;
    return {
      currentTime,
      currentDate
    };
  }

  const [date, setDate] = useState(getTimeAndDate().date);
  const [time, setTime] = useState(getTimeAndDate().time);
  const [showDropdown, setShowDropdown] = useState(false);

  function updateDateTime() {
    let newDate;
    const timeMoment = momentTimezone(time, 'LT', true, timeZone);
    const dateMoment = momentTimezone(date, 'LT', true, timeZone);

    if (date && dateMoment.isValid()) {
      newDate = dateMoment.set({
        hour: timeMoment.get('hour'),
        minute: timeMoment.get('minute')
      });
    } else {
      newDate = timeMoment;
    }

    setDate(newDate);

    if (onChange) onChange(newDate);
    return newDate;
  }

  function clearDateTime() {
    if (shouldClearDateTime) {
      setTime('');
      setDate(undefined);

      if (onChange) onChange(null);
    }
  }

  function handleChange(e) {
    const newTime = e.currentTarget.value;

    if (!regex.AT_LEAST_ONE_DIGIT.test(newTime)) {
      if (!regex.AT_LEAST_ONE_DIGIT.test(time)) {
        return;
      }

      clearDateTime();
    }

    setTime(newTime);
  }

  function handleBlur() {
    const momentTime = momentTimezone(time, 'LT', moment(locale), true);

    if (regex.AT_LEAST_ONE_DIGIT.test(time) && !momentTime.isValid()) {
      setTime('');

      if (onChange) onChange(null);
    }
  }

  function onSelect(newDate) {
    setTime(formatTime(newDate, timeZone, locale, getMask()));
    setDate(newDate);
    setShowDropdown(false);

    if (onChange) onChange(newDate);
  }

  function onFocus() {
    return setShowDropdown(true);
  }

  function handleTimeKeys(e) {
    let newDate;
    let remainder;
    let above;
    const valueMoment = momentTimezone(value, 'LT', true, timeZone);
    const currentDate = value ? valueMoment : date;
    if (!currentDate) return;

    switch (e.keyCode) {
      case keyCodes.UP_ARROW:
        remainder = currentDate.minute() % interval || interval;
        newDate = currentDate.subtract(remainder, 'minutes');
        break;

      case keyCodes.DOWN_ARROW:
        above = interval - (currentDate.minute() % interval);
        newDate = currentDate.add(above, 'minutes');
        break;

      case keyCodes.ESCAPE:
      case keyCodes.ENTER:
        setShowDropdown(false);
        break;

      default:
        break;
    }

    if (newDate) {
      setTime(formatTime(newDate, timeZone, locale));
      setDate(newDate);

      e.preventDefault();
      e.stopPropagation();
    }
  }

  function onClickOutside() {
    return setShowDropdown(false);
  }

  function getFormatChars() {
    const enUsFormatChars = {
      // enUS
      1: '[0-1]',
      2: time.startsWith('1') ? '[0-2]' : '[1-9]',
      3: '[0-5]',
      4: '[0-9]',
      A: '[a|p|A|P]'
    };
    const otherFormatChars = {
      1: '[0-2]',
      2: time.startsWith('2') ? '[0-3]' : '[0-9]',
      3: '[0-5]',
      4: '[0-9]'
    };
    return ['enUS'].includes(locale) ? enUsFormatChars : otherFormatChars;
  }

  useEffect(() => {
    const momentTime = momentTimezone(time, 'LT', moment(locale), true);

    if (momentTime.isValid()) {
      updateDateTime(time);
    }
  }, [time]);

  useEffect(() => {
    if (onChange) onChange();
  }, [time, date]);

  momentTimezone.locale(moment(locale));

  momentTimezone.tz.setDefault(timeZone);

  const prevValue = usePrevious(value);

  if (value !== prevValue) {
    const { currentTime, currentDate } = getTimeAndDate();

    setTime(currentTime);
    setDate(currentDate);
  }

  return (
    <div className={classes}>
      <BaseField label={label} size={inputSize}>
        <MaskedInput
          onFocus={onFocus}
          onChange={handleChange}
          onKeyDown={handleTimeKeys}
          onBlur={handleBlur}
          value={time}
          mask={getMask()}
          formatChars={getFormatChars()}
          className="pp-text-uppercase"
          maskChar="_"
        >
          {showDropdown && (
            <div
              className="pp-position-absolute"
              style={{
                zIndex: 20
              }}
            >
              <TimePickerDropdown
                value={value}
                onSelect={onSelect}
                locale={locale}
                times={getTimes(props)}
                timezone={timeZone}
                handleClickOutside={onClickOutside}
              />
            </div>
          )}
        </MaskedInput>
      </BaseField>
    </div>
  );
}
