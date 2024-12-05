import Table from "@/app/shared/components/Table";
import clsx from "clsx";
import React, { Fragment } from "react";

type Props = {};

const columns = ["Product", "Quantity", "Subtotal"];
const data = [
  { id: 1, product: "Wax Candles", quantity: 1, subtotal: 100 },
  { id: 2, product: "Wax Candles", quantity: 1, subtotal: 100 },
  { id: 3, product: "Wax Candles", quantity: 1, subtotal: 100 },
];
const totalData = {
  subtotal: 300,
  shipping: 100,
  total: 400,
};
const CartDetails = (props: Props) => {
  return (
    <section className="cart-details">
      <Table>
        <Table.Head>
          <Table.Row type="header">
            <Table.Cell type="header" colSpan={10} classes="text-left">
              Cart Details
            </Table.Cell>
          </Table.Row>
        </Table.Head>
        <Table.Body classes="border border-solid border-gray-100 border-b-0">
          <Table.Row type="data" classes="border-dashed">
            {columns.map((column) => {
              return <Table.Cell type="cell" key={column} data={column} />;
            })}
          </Table.Row>
          {data.map((item) => {
            const { id, product, quantity, subtotal } = item;
            return (
              <Table.Row
                type="data"
                key={id}
                classes="border-r border-l border-b-0 border-t-0"
              >
                <Table.Cell type="cell" data={product} classes="text-left" />
                <Table.Cell type="cell" data={quantity} />
                <Table.Cell type="cell" data={subtotal} />
              </Table.Row>
            );
          })}
        </Table.Body>
        <Table.Footer classes="border-gray-100 border-t-0">
          {Object.entries(totalData).map(([key, value]) => {
            return (
              <Table.Row type="data" key={key} classes="border-dashed">
                <Table.Cell
                  type="cell"
                  classes={clsx(
                    "capitalize text-left",
                    key === "total" && "font-roboto-bold",
                  )}
                  data={key}
                />
                <Table.Cell
                  type="cell"
                  colSpan={2}
                  data={value}
                  classes={clsx(key === "total" && "font-roboto-bold")}
                />
              </Table.Row>
            );
          })}
        </Table.Footer>
      </Table>
    </section>
  );
};

export default CartDetails;
