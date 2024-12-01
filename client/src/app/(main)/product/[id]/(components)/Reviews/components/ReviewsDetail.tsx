import Button from "@/app/shared/components/Button";
import Form from "@/app/shared/components/Form";
import RatingInput from "@/app/shared/components/RatingInput";
import Textarea from "@/app/shared/components/Textarea";
import avatarImg from "@/app/resources/images/homepage/product-1.jpg";
import { ChevronRight } from "lucide-react";
import React, { useState } from "react";
import Avatar from "@/app/shared/components/Avatar";

const ReviewsDetail = () => {
  const [review, setReview] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const handleSelectStar = (starNum: number) => {
    setRating(starNum);
  };
  const handleChangeReview = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReview(e.target.value);
  };
  const handleSubmitReview = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log(review, rating);
  };
  return (
    <div className="content__reviews">
      <div className="content__reviews-input">
        <Form classes="border-bg-primary border border-solid rounded-[14px] p-[30px] flex items-start gap-gutter">
          <Avatar imgSrc={avatarImg.src} />
          <div className="flex-1">
            <Form.Group classes="h-[140px] rounded-[14px] border-bg-primary overflow-hidden">
              <Form.Input
                renderInput={() => (
                  <Textarea
                    placeholder="Write your review here..."
                    className="h-full w-full resize-none bg-transparent p-[20px] font-roboto-regular text-bg-primary duration-300 placeholder:text-bg-primary focus:outline-none"
                    onChange={handleChangeReview}
                  />
                )}
              />
            </Form.Group>
            <Form.Group classes="flex items-center justify-between gap-gutter border-none mt-[30px]">
              <Form.Group
                label="Your Ratings:"
                classes="border-none flex items-center gap-[8px] text-bg-secondary font-roboto-medium"
              >
                <Form.Input
                  renderInput={() => (
                    <RatingInput
                      handleSelectStar={handleSelectStar}
                      currentRating={rating}
                    />
                  )}
                />
              </Form.Group>
              <Button variant="secondary" onClick={handleSubmitReview}>
                <span>Submit</span>
                <ChevronRight />
              </Button>
            </Form.Group>
          </div>
        </Form>
      </div>
      <ul className="content_reviews-list h-ful mt-[40px] flex max-h-[600px] min-h-[500px] flex-col gap-[32px] overflow-y-scroll rounded-[14px] border border-solid border-bg-primary p-[30px]">
        {Array.from({ length: 10 }).map((index) => {
          return (
            <li className="flex items-start gap-gutter">
              <Avatar imgSrc={avatarImg.src} />
              <div className="flex-1">
                <div>
                  <p className="font-roboto-medium text-body-big text-bg-secondary">
                    Mike jones
                  </p>
                  <p className="font-roboto-regular text-bg-secondary">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  </p>
                </div>
                <div className="mt-[8px] flex items-center gap-[8px] text-bg-secondary">
                  <RatingInput
                    handleSelectStar={() => {}}
                    currentRating={2}
                    clickable={false}
                  />
                  <p className="font-roboto-regular text-bg-secondary">
                    12/12/2024
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ReviewsDetail;
