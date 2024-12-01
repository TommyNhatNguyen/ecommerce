import Button from "@/app/shared/components/Button";
import clsx from "clsx";
import { Star } from "lucide-react";
import React from "react";

type RatingInputPropsType = {
  handleSelectStar: (index: number) => void;
  currentRating: number;
  clickable?: boolean;
};

const RatingInput = ({
  currentRating,
  handleSelectStar,
  clickable = true,
}: RatingInputPropsType) => {
  const handleClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    starPosition: number,
  ) => {
    e.preventDefault();
    handleSelectStar(starPosition);
  };

  return (
    <ul className="stars flex items-center gap-2">
      {[...Array(5)].map((_, starPosition) => (
        <li key={starPosition}>
          <Button
            variant="vanilla"
            classes="h-fit px-0"
            onClick={(e) => handleClick(e, starPosition)}
            disabled={!clickable}
          >
            <Star
              className={clsx(
                "star duration-300",
                starPosition <= currentRating &&
                  "fill-yellow-500 text-yellow-500",
              )}
            />
          </Button>
        </li>
      ))}
    </ul>
  );
};
export default RatingInput;
