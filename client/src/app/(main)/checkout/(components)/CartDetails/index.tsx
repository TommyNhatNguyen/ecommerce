import Table from "@/app/shared/components/Table";
import React from "react";

type Props = {};

const CartDetails = (props: Props) => {
  return (
    <section className="cart-details">
      <Table>
        <Table.Head>
          <Table.Row type="header">
            <Table.Cell type="header" colSpan={5} classes="text-left">
              Cart Details
            </Table.Cell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Row type="data">
            <Table.Cell type="cell">Product</Table.Cell>
            <Table.Cell type="cell">Quantity</Table.Cell>
            <Table.Cell type="cell">Subtotal</Table.Cell>
          </Table.Row>
          <Table.Row type="data">
            <Table.Cell type="cell">Wax Candles</Table.Cell>
            <Table.Cell type="cell">1</Table.Cell>
            <Table.Cell type="cell">100</Table.Cell>
          </Table.Row>
          <Table.Row type="data">
            <Table.Cell type="cell">Wax Candles</Table.Cell>
            <Table.Cell type="cell">1</Table.Cell>
            <Table.Cell type="cell">100</Table.Cell>
          </Table.Row>
          <Table.Row type="data">
            <Table.Cell type="cell">Wax Candles</Table.Cell>
            <Table.Cell type="cell">1</Table.Cell>
            <Table.Cell type="cell">100</Table.Cell>
          </Table.Row>
        </Table.Body>
        <Table.Footer>
          <Table.Row type="data">
            <Table.Cell type="cell">Subtotal</Table.Cell>
            <Table.Cell type="cell" colSpan={2}>300</Table.Cell>
          </Table.Row>
          <Table.Row type="data">
            <Table.Cell type="cell">Shipping</Table.Cell>
            <Table.Cell type="cell" colSpan={2}>100</Table.Cell>
          </Table.Row>
          <Table.Row type="data">
            <Table.Cell type="cell">Total</Table.Cell>
            <Table.Cell type="cell" colSpan={2}>400</Table.Cell>
          </Table.Row>
        </Table.Footer>
      </Table>
    </section>
  );
};

export default CartDetails;
