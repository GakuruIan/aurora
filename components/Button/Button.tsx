"use client";
import React from "react";

type ButtonProps = {
  type: "button" | "submit" | "reset";
  label: string;
  onClick?: () => void;
  style?: string;
};

const Button = ({ label, onClick, style, type }: ButtonProps) => {
  return (
    <button
      type={type}
      className={`py-3 px-4 text-center rounded-sm w-full ${style}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default Button;
