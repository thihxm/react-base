import React from 'react';

import reactOnclickoutside from 'react-onclickoutside';

import classnames from 'classnames';

import { Dropdown, Anchor } from 'pipestyle';

import { getTime } from 'date-fns';
import formatTime from './utils/formatTime';

function TimePickerDropdown(props) {
  const {
    value = undefined,
    locale: refLocale = 'enUS',
    timeZone,
    onSelect,
    times
  } = props;
  const locale = refLocale === undefined ? 'enUS' : refLocale;

  function onClick({ time }) {
    return function(e) {
      onSelect(time);
      e.preventDefault();
    };
  }

  return (
    <Dropdown selectable size="sm" className="pp-overflow-auto">
      <div>
        {times.map(time => {
          const title = formatTime(time, timeZone, locale);
          const isActive = value && value.diff(time, 'minutes') === 0;

          return (
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
                title={title}
                aria-label={title}
              >
                <span>{title}</span>
              </Anchor>
            </div>
          );
        })}
      </div>
    </Dropdown>
  );
}

export default reactOnclickoutside(TimePickerDropdown);
