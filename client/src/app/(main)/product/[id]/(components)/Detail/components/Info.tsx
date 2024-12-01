"use client";
import Button from "@/app/shared/components/Button";
import Form from "@/app/shared/components/Form";
import clsx from "clsx";
import { Car, Heart, Package, ShoppingCart, Star, Truck } from "lucide-react";
import React, { useState } from "react";

type Props = {};

const Info = (props: Props) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const _onFavorite = () => {
    setIsFavorite((prev) => !prev);
  };
  const _onQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(Number(e.target.value));
  };
  const _onQuantityIncrease = () => {
    setQuantity((prev) => prev + 1);
  };
  const _onQuantityDecrease = () => {
    setQuantity((prev) => prev - 1);
  };
  return (
    <div className="content__info">
      <div className="content__info-group">
        <div className="title flex items-center justify-between gap-gutter">
          <h2 className="font-roboto-bold text-h2">Double Bed & Side Tables</h2>
          <Button
            variant="vanilla"
            classes="btn btn-heart"
            onClick={_onFavorite}
          >
            <Heart
              className={clsx(
                "h-16 w-16 transition-all duration-300",
                isFavorite && "color-pink-200 fill-pink-200",
              )}
            />
          </Button>
        </div>
        <div className="pricegroup mt-[20px] flex items-center gap-[20px]">
          <div className="pricegroup__text relative w-fit">
            <p className="pricegroup__text-price h-full font-roboto-medium text-body-big">
              $54.98
            </p>
            <div className="absolute bottom-0 right-[-10px] top-0 h-full w-[1px] bg-green-300"></div>
          </div>
          <div className="pricegroup__starsgroup flex items-center gap-[10px]">
            <div className="pricegroup__starsgroup-list starslist flex items-center gap-[4px]">
              <Star />
              <Star />
              <Star />
              <Star />
              <Star />
            </div>
            <div className="pricegroup__starsgroup-reviews">
              <span className="score mr-[4px]">4.9</span>
              <span className="reviews text-body-sub">(123 reviews)</span>
            </div>
          </div>
        </div>
        <div className="my-[30px] h-[1px] w-full bg-gray-100"></div>
        <div className="description">
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Placeat,
            ratione nam! Nobis iste corporis ipsa unde! Atque fugit et non
            recusandae eveniet qui quia obcaecati harum. Vitae quod atque
            reprehenderit.
          </p>
          <ul className="ml-[4px] list-inside list-disc mt-[16px]">
            <li>Lorem ipsum dolor sit amet, consectetuer adipi scing elit</li>
            <li>Lorem ipsum dolor sit amet, consectetuer adipi scing elit</li>
            <li>Lorem ipsum dolor sit amet, consectetuer adipi scing elit</li>
          </ul>
        </div>
        <div className="actionsgroup mt-[30px]">
          <div className="actionsgroup__quantity">
            <Form.Group classes="border-none flex items-center gap-gutter w-full">
              <div className="flex w-full max-w-fit flex-shrink-0 items-center rounded-full bg-white">
                <Button
                  variant="vanilla"
                  onClick={_onQuantityDecrease}
                  classes="hover:bg-green-300 hover:text-white duration-300"
                >
                  -
                </Button>
                <Form.Input
                  type="number"
                  value={quantity}
                  classes="text-center w-[50px]"
                  onChange={_onQuantityChange}
                />
                <Button
                  variant="vanilla"
                  onClick={_onQuantityIncrease}
                  classes="hover:bg-green-300 hover:text-white duration-300"
                >
                  +
                </Button>
              </div>
              <Button
                variant="primary"
                classes="btn-addcart flex-1 font-roboto-medium"
              >
                <ShoppingCart />
                Add to Cart
              </Button>
            </Form.Group>
          </div>
          <Button
            variant="accent-1"
            classes="actionsgroup__buynow btn btn-buynow font-roboto-medium w-full mt-[30px]"
          >
            Buy Now
          </Button>
        </div>
        <div className="shipping mt-[32px]">
          <div className="shipping__item flex items-center gap-[8px]">
            <Truck />
            <span>Free Shipping on orders over $50</span>
          </div>
          <div className="shipping__item flex items-center gap-[8px] mt-[12px]">
            <Package/>
            <span>Delivers in: 3-7 Working Days Shipping & Return</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Info;
