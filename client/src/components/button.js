import React from 'react';

const Button = props => {
  return (
    <button onClick={props.clickHandler} className="button">
      {props.value}
    </button>
  );
};

export default Button;
