import React from "react";

type Props = {
  description: string;
  name: string;
};

const Description = ({ description, name }: Props) => {
  return (
    <div className="content__description text-white">
      <h3 className="font-roboto-bold text-h3">{name}</h3>
      <div
        className="text-p1 mt-[16px] max-h-[1000px] overflow-y-auto"
        dangerouslySetInnerHTML={{ __html: description as string }}
      ></div>
    </div>
  );
};

export default Description;
