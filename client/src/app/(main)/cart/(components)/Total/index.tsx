import Button from "@/app/shared/components/Button";
import Table from "@/app/shared/components/Table";
import clsx from "clsx";
import { ShoppingBasket } from "lucide-react";
import React from "react";

type Props = {
  handleCheckout: () => void;
};
const totalInfo = {
  subtotal: 100000,
  discount: 20000,
  shipping: 10000,
  total: 90000,
};
const Total = ({ handleCheckout }: Props) => {
  const _onCheckout = () => {
    handleCheckout();
  }
  return (
    <Table>
      <Table.Head>
        <Table.Row type="header">
          <Table.Cell
            data="Cart Total"
            type="header"
            classes="capitalize text-left"
            colSpan={2}
          />
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {Object.entries(totalInfo).map(([key, value]) => {
          return (
            <Table.Row key={key} type="data">
              <Table.Cell
                data={key}
                classes={clsx(
                  "capitalize text-left text-body-big",
                  key === "total" && "font-roboto-bold",
                )}
              />
              <Table.Cell data={value} />
            </Table.Row>
          );
        })}
      </Table.Body>
      <Table.Footer>
        <Table.Row type="header" classes="h-fit">
          <Table.Cell colSpan={2} classes="p-0">
            <Button
              onClick={_onCheckout}
              variant="accent-1"
              classes="w-full rounded-none px-0 text-bg-primary"
            >
              <ShoppingBasket />
              <span className="font-roboto-bold text-body-big">
                Proceed to checkout
              </span>
            </Button>
          </Table.Cell>
        </Table.Row>
      </Table.Footer>
    </Table>
  );
};

export default Total;
