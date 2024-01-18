import React, { FC, ReactNode } from "react";

interface ICustomButton {
    onClick?: () => void;
    value: string;
}


const CustomButton = ({ onClick, value }: ICustomButton) => {
  return (
    <button
      style={{
        color: "white",
        margin: "2em",
        backgroundColor: "#4e44ce",
        padding: "0.6em",
        borderRadius: "0.5em",
      }}
      onClick={() => onClick}
    >
      {value}
    </button>
  );
};

export default CustomButton;