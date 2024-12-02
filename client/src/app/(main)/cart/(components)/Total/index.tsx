import Button from "@/app/shared/components/Button";
import Table from "@/app/shared/components/Table";
import clsx from "clsx";
import { ShoppingBasket } from "lucide-react";
import React from "react";

type Props = {};
const totalInfo = {
  subtotal: 100000,
  discount: 20000,
  shipping: 10000,
  total: 90000,
};
const Total = (props: Props) => {
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
            <Table.Row type="data">
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
          <Table.Cell colSpan={2} classes="px-0">
            <Button variant="accent-1" classes="w-full rounded-none px-0 text-bg-primary">
              <ShoppingBasket />
              <span className="text-body-big font-roboto-bold">Proceed to checkout</span>
            </Button>
          </Table.Cell>
        </Table.Row>
      </Table.Footer>
    </Table>
  );
};

export default Total;
