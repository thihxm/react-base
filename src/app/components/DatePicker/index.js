/*
Pipestyle DatePicker fork
*/
/* eslint-disable */
import React, { useState, useEffect } from 'react';
import ReactDatePicker from 'react-datepicker';
import MomentTimezone from 'moment-timezone';
import styled from 'styled-components';
import { parseISO, format, isValid } from 'date-fns';
import {
  zonedTimeToUtc,
  utcToZonedTime,
  format as formatTZ
} from 'date-fns-tz';
import * as locales from 'date-fns/locale';

import { MdClose } from 'react-icons/md';

import {
  Button,
  BaseField,
  Dropdown,
  MaskedInput,
  TimePicker
} from 'pipestyle';
import 'pipestyle/assets/button.css';
import 'pipestyle/assets/form.css';
import 'pipestyle/assets/dropdown.css';
import isEmpty from 'pipestyle/lib/utils/isEmpty';
import keyCodes from 'pipestyle/lib/utils/keyCodes';
import moment from 'pipestyle/lib/utils/moment';
import 'pipestyle/lib/utils/moment-locales';
import 'react-datepicker/dist/react-datepicker.css';
import './styles.css';
/* eslint-enable */
/* eslint-disable react/prop-types */

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
  console.log(formattedDate);
  return formattedDate;
}

export default function DatePicker(props) {
  const {
    locale = 'ptBR',
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
    today = undefined,
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
    if (!MomentTimezone(dateText, ['L', 'l'], moment(locale), true).isValid()) {
      setDateText('');
    }
  }

  function handleTextChange(e) {
    const newDateText = e.currentTarget.value;
    const newDate = MomentTimezone(
      newDateText,
      ['L', 'l'],
      moment(locale),
      true
    );

    if (newDate) {
      const utcDate = newDate.utc();

      newDate.utc().set({
        hour: utcDate.get('hour'),
        minute: utcDate.get('minute')
      });
    }

    setDateText(newDateText);
    setDate(newDate.isValid() ? newDate : date);
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
    return true;
  }

  function handleKeys(e) {
    const currentDate = date || MomentTimezone();

    onChange(currentDate);

    MomentTimezone.locale(moment(locale));

    let newDate;

    switch (e.keyCode) {
      case keyCodes.UP_ARROW:
        newDate = MomentTimezone(currentDate).subtract(7, 'days');
        break;

      case keyCodes.DOWN_ARROW:
        newDate = MomentTimezone(currentDate).add(7, 'days');
        break;

      case keyCodes.LEFT_ARROW:
        newDate = MomentTimezone(currentDate).subtract(1, 'days');
        break;

      case keyCodes.RIGHT_ARROW:
        newDate = MomentTimezone(currentDate).add(1, 'days');
        break;

      case keyCodes.PAGE_UP:
        newDate = MomentTimezone(currentDate).subtract(1, 'months');
        break;

      case keyCodes.PAGE_DOWN:
        newDate = MomentTimezone(currentDate).add(1, 'months');
        break;

      case keyCodes.HOME:
        newDate = MomentTimezone(currentDate).startOf('week');
        break;

      case keyCodes.END:
        newDate = MomentTimezone(currentDate).endOf('week');
        break;

      case keyCodes.ESCAPE:
        newDate = MomentTimezone();
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

  MomentTimezone.locale(moment(locale));

  MomentTimezone.tz.setDefault(timeZone);

  useEffect(() => {
    if (value) value.locale(moment(locale));
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

  MomentTimezone.locale(moment(locale));

  const fullAriaLabel =
    date &&
    ''.concat(ariaLabel).concat(
      MomentTimezone(date)
        .tz(timeZone)
        .format('LL')
    );

  return (
    <Dropdown className="pp-date-picker">
      <Header>
        <CloseButton onClick={onClose} />
      </Header>
      <div className="col-md-12 pp-no-padding">
        <div className="col-md-6 pp-no-padding">
          <BaseField label={dateLabel} size="sm">
            {console.log('aqui', dateText)}
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
            value={MomentTimezone(date)}
            onChange={handleChange}
            start={MomentTimezone(date || today).startOf('day')}
            end={MomentTimezone(date || today).endOf('day')}
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
          wight: 0,
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
        selected={
          date &&
          MomentTimezone(date)
            .tz(timeZone)
            .toDate()
        }
        dropdownMode="select"
        onChange={handleChange}
        locale={locales[locale]}
        timeFormat="p"
        dateFormat="Pp"
        timezone={timeZone}
        dateFormatCalendar=" "
        clearButtonTitle={clearButtonLabel}
        utcOffset={date && MomentTimezone(date).utcOffset()}
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
