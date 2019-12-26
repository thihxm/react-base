import React, { useState } from 'react';
import styled from 'styled-components';
import MyDatePicker from '../../components/DatePicker';
import 'pipestyle/assets/dropdown.css';
import 'pipestyle/assets/form.css';
import 'pipestyle/assets/button.css';

const Wrapper = styled.div`
  position: absolute;
  z-index: 100;
  display: ${props => (props.active ? 'block' : 'none')};
`;

function DatePicker({ active, value, onChange, onClose }) {
  return (
    <Wrapper active={active}>
      <MyDatePicker
        dateLabel="Date"
        timeLabel="Time"
        clearButtonLabel="Leave date blank"
        showTime
        showClearButton
        locale="ptBR"
        timeZone="America/Sao_Paulo"
        value={value}
        onChange={onChange}
        onClose={onClose}
      />
    </Wrapper>
  );
}

export default function Main() {
  const [date, setDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(true);

  function handleDateChange(value) {
    console.log(value);
    setDate(value);
  }
  function toggleDatePicker() {
    console.log('fechar');
    setShowDatePicker(!showDatePicker);
  }

  return (
    <>
      <DatePicker
        active={showDatePicker}
        value={date}
        onChange={handleDateChange}
        onClose={toggleDatePicker}
      />
      <button
        style={{ position: 'absolute', right: 0 }}
        type="button"
        onClick={toggleDatePicker}
      >
        Abir/fechar DatePicker
      </button>
    </>
  );
}
