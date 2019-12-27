import React from 'react';

import classnames from 'classnames';

import { Dropdown, Anchor } from 'pipestyle';

import { getTime } from 'date-fns';
import formatTime from './utils/formatTime';

function onClick(onSelect, time) {
  return function(e) {
    onSelect(time);
    e.preventDefault();
  };
}

export default function TimePickerDropdown(_ref) {
  const {
    value = undefined,
    locale: refLocale = 'enUS',
    timeZone,
    onSelect,
    times
  } = _ref;
  const locale = refLocale === undefined ? 'enUS' : refLocale;

  return (
    <Dropdown selectable size="sm" className="pp-overflow-auto">
      <div>
        {times.map(time => {
          const title = formatTime(time, timeZone, locale);
          const isActive = value && value.diff(time, 'minutes') === 0;
          <div
            key={getTime(time)}
            className={classnames('pp-item-list', {
              'pp-active': isActive
            })}
          >
            <Anchor
              id={'time_'.concat(getTime(time))}
              onClick={onClick(onSelect, time)}
              tabIndex={0}
              title
              aria-label={title}
            >
              <span>{title}</span>
            </Anchor>
          </div>;

          return true;
        })}
      </div>
    </Dropdown>
  );
}
