import React from "react";

type TextareaPropsType = {
  children?: React.ReactNode;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = ({ children, ...props }: TextareaPropsType) => {
  return <textarea {...props}>{children}</textarea>;
};

export default Textarea;
