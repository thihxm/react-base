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

const Container = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-evenly;
`;

function DatePicker({ active, value, onChange, onClose, onSave, onCancel }) {
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
        onSave={onSave}
        onCancel={onCancel}
      />
    </Wrapper>
  );
}

export default function Main() {
  const [date, setDate] = useState(new Date());
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
    <Container>
      <div>
        <DatePicker
          active={showDatePicker}
          value={date}
          onChange={handleDateChange}
          onClose={toggleDatePicker}
          onCancel={toggleDatePicker}
        />
      </div>
      <div>
        <button type="button" onClick={toggleDatePicker}>
          Abir/fechar DatePicker
        </button>
      </div>
    </Container>
  );
}
