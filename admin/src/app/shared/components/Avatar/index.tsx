import React from 'react'
import Button from "../Button";

type AvatarPropsType = {
  children?: React.ReactNode;
  imgSrc: string;
};

const Avatar = ({ children, imgSrc }: AvatarPropsType) => {
  return (
    <Button
      variant="vanilla"
      classes="h-[52px] aspect-square rounded-full px-0 overflow-hidden flex-shrink-0"
    >
      <img
        src={imgSrc}
        alt="avatar"
        className="h-full w-full object-cover"
      />
      {children}
    </Button>
  );
}

export default Avatar