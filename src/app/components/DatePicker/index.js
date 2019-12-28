/*
Pipestyle DatePicker fork
*/
import React, { useState, useEffect } from 'react';
import ReactDatePicker from 'react-datepicker';
import styled from 'styled-components';
import {
  parse,
  isValid,
  startOfDay,
  endOfDay,
  set,
  addDays,
  subDays,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek
} from 'date-fns';
import {
  zonedTimeToUtc,
  utcToZonedTime,
  format as formatTZ
} from 'date-fns-tz';
import * as locales from 'date-fns/locale';

import { MdClose } from 'react-icons/md';

import { Button, BaseField, Dropdown, MaskedInput } from 'pipestyle';
import 'pipestyle/assets/button.css';
import 'pipestyle/assets/form.css';
import 'pipestyle/assets/dropdown.css';
import isEmpty from 'pipestyle/lib/utils/isEmpty';
import keyCodes from 'pipestyle/lib/utils/keyCodes';
import 'react-datepicker/dist/react-datepicker.css';
import './styles.css';
/* eslint-disable react/prop-types */

import TimePicker from '../TimePicker';

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
`;
const Separator = styled.hr`
  margin: 20px 0;
`;
const CloseButton = styled(MdClose)`
  position: relative;
  &:hover {
    cursor: pointer;
  }
`;
const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

function formatDate(_ref) {
  const { date, timeZone, locale } = _ref;
  const formattedDate = formatTZ(date || new Date(), 'dd/MM/yyyy', {
    locale: locales[locale],
    timeZone
  });
  return formattedDate;
}

export default function DatePicker(props) {
  const {
    locale = 'enUS',
    timeLabel = '',
    clearButtonLabel = '',
    ariaLabel = '',
    value = undefined,
    dateMask = {},
    timeMask = {},
    showTime = false,
    showClearButton = false,
    onChange = function onChange() {},
    onCancel = function onCancel() {},
    onSave = function onSave() {},
    onClose = function onSave() {},
    today = new Date(),
    dateLabel = '',
    timeZone = 'America/Sao_Paulo'
  } = props;

  const [date, setDate] = useState(new Date());
  const [dateText, setDateText] = useState(
    formatDate({
      date,
      timeZone,
      locale
    })
  );

  useEffect(() => {
    if (date) return isValid(date) && onChange(date);
    // eslint-disable-next-line
  }, [date, dateText]);

  function handleChange(newDate) {
    if (!newDate) return;
    setDate(newDate);
    setDateText(
      formatDate({
        date: newDate,
        timeZone,
        locale
      })
    );
  }

  function handleBlur() {
    if (
      !isValid(
        parse(dateText, 'dd/MM/yyyy', new Date(), { locale: locales[locale] })
      ) ||
      !isValid(
        parse(dateText, 'd/MM/yyyy', new Date(), { locale: locales[locale] })
      )
    ) {
      setDateText('');
    }
  }

  function handleTextChange(e) {
    const newDateText = e.currentTarget.value;
    if (newDateText.includes('_')) return console.log('Data incompleta');
    let newDate = parse(newDateText, 'dd/MM/yyyy', new Date(), {
      locale: locales[locale]
    });
    if (!isValid(newDate)) {
      e.currentTarget.value = '';
      return console.log('Data inválida');
    }

    if (newDate) {
      const utcDate = zonedTimeToUtc(newDate, timeZone);

      newDate = set(newDate, utcToZonedTime(utcDate, timeZone));
    }

    setDateText(newDateText);
    setDate(isValid(newDate) ? newDate : date);
    return true;
  }

  function updateDate(newDate) {
    setDate(newDate);
    setDateText(
      formatDate({
        newDate,
        timeZone,
        locale
      })
    );
    handleChange(newDate);
    return true;
  }

  function handleKeys(e) {
    const currentDate = date || new Date();

    onChange(currentDate);

    let newDate;

    switch (e.keyCode) {
      case keyCodes.UP_ARROW:
        newDate = subDays(currentDate, 7);
        break;

      case keyCodes.DOWN_ARROW:
        newDate = addDays(currentDate, 7);
        break;

      case keyCodes.LEFT_ARROW:
        newDate = subDays(currentDate, 1);
        break;

      case keyCodes.RIGHT_ARROW:
        newDate = addDays(currentDate, 1);
        break;

      case keyCodes.PAGE_UP:
        newDate = subMonths(currentDate, 1);
        break;

      case keyCodes.PAGE_DOWN:
        newDate = addMonths(currentDate, 1);
        break;

      case keyCodes.HOME:
        newDate = startOfWeek(currentDate);
        break;

      case keyCodes.END:
        newDate = endOfWeek(currentDate);
        break;

      case keyCodes.ESCAPE:
        newDate = new Date();
        break;

      default:
        break;
    }

    if (newDate) {
      updateDate(newDate);

      e.preventDefault();
      e.stopPropagation();
    }
  }

  function clearDate() {
    setDateText('');
    setDate(undefined);
    return onChange(undefined);
  }

  useEffect(() => {
    setDateText(
      value
        ? formatDate({
            date: value,
            timeZone,
            locale
          })
        : ''
    );
    setDate(value || undefined);
    // eslint-disable-next-line
  }, []);

  const { mask } = dateMask;
  const formatChars = mask;

  const fullAriaLabel =
    date &&
    ''.concat(ariaLabel).concat(
      formatTZ(date || new Date(), 'dd/MM/yyyy', {
        locale: locales[locale],
        timeZone
      })
    );

  return (
    <Dropdown className="pp-date-picker">
      <Header>
        <CloseButton onClick={onClose} />
      </Header>
      <div className="col-md-12 pp-no-padding">
        <div className="col-md-6 pp-no-padding">
          <BaseField label={dateLabel} size="sm">
            <MaskedInput
              value={dateText}
              onChange={handleTextChange}
              onBlur={handleBlur}
              mask={mask || '99/99/9999'}
              formatChars={
                isEmpty(formatChars)
                  ? {
                      '9': '[0-9]'
                    }
                  : formatChars
              }
              maskChar="_"
            />
          </BaseField>
        </div>
        {showTime && (
          <TimePicker
            label={timeLabel}
            value={date}
            onChange={handleChange}
            start={startOfDay(date || today)}
            end={endOfDay(date || today)}
            interval={30}
            locale={locale}
            timezone={timeZone}
            timeMask={timeMask}
            shouldClearDateTime={false}
          />
        )}
      </div>
      <input
        id="calendar"
        style={{
          height: 0,
          width: 0,
          border: 0
        }}
        tabIndex={0}
        onKeyDown={handleKeys}
        aria-label={fullAriaLabel}
      />
      <ReactDatePicker
        inline
        showMonthDropdown
        showYearDropdown
        selected={date}
        dropdownMode="select"
        onChange={handleChange}
        locale={locales[locale]}
        timeFormat="p"
        dateFormat="Pp"
        timeZone={timeZone}
        dateFormatCalendar=" "
        clearButtonTitle={clearButtonLabel}
      />
      <ButtonContainer>
        <Button theme="dark" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSave}>Save</Button>
      </ButtonContainer>
      <Separator />
      {showClearButton && (
        <Button
          title={clearButtonLabel}
          aria-label={clearButtonLabel}
          onClick={clearDate}
          className="clear"
        >
          {clearButtonLabel}
        </Button>
      )}
    </Dropdown>
  );
}
