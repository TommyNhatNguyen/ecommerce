import { ROUTES } from "@/app/constants/routes";
import Button from "@/app/shared/components/Button";
import Table from "@/app/shared/components/Table";
import { X } from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = {};
const productsList = [
  {
    id: 1,
    imageUrl:
      "https://fastly.picsum.photos/id/239/200/300.jpg?hmac=jBV5mUiY1RXDAmu4rQXOdWeutyztlxqFSOVpnJ-QUb8",
    name: "Product 1",
    price: 100000,
    quantity: 2,
    total: 100000 * 2,
  },
  {
    id: 2,
    imageUrl:
      "https://fastly.picsum.photos/id/239/200/300.jpg?hmac=jBV5mUiY1RXDAmu4rQXOdWeutyztlxqFSOVpnJ-QUb8",
    name: "Product 2",
    price: 150000,
    quantity: 1,
    total: 150000 * 1,
  },
  {
    id: 3,
    imageUrl:
      "https://fastly.picsum.photos/id/239/200/300.jpg?hmac=jBV5mUiY1RXDAmu4rQXOdWeutyztlxqFSOVpnJ-QUb8",
    name: "Product 3",
    price: 200000,
    quantity: 3,
    total: 200000 * 3,
  },
  {
    id: 4,
    imageUrl:
      "https://fastly.picsum.photos/id/239/200/300.jpg?hmac=jBV5mUiY1RXDAmu4rQXOdWeutyztlxqFSOVpnJ-QUb8",
    name: "Product 4",
    price: 250000,
    quantity: 1,
    total: 250000 * 1,
  },
  {
    id: 5,
    imageUrl:
      "https://fastly.picsum.photos/id/239/200/300.jpg?hmac=jBV5mUiY1RXDAmu4rQXOdWeutyztlxqFSOVpnJ-QUb8",
    name: "Product 5",
    price: 300000,
    quantity: 2,
    total: 300000 * 2,
  },
];
const columns = ["No", "Product", "Price", "Quantity", "Total"];
const Products = (props: Props) => {
  return (
    <div className="cart__products h-full w-full">
      <Table>
        <Table.Head>
          <Table.Row type="header">
            {columns.map((column) => {
              return <Table.Cell key={column} data={column} type="header" />;
            })}
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {productsList.length > 0 &&
            productsList.map((product, index) => {
              const { id, imageUrl, name, price, quantity, total } = product;
              return (
                <Table.Row key={id} type="data">
                  <Table.Cell data={id} />
                  <Table.Cell classes="flex h-[78px] content-center items-center justify-center gap-[6px] text-nowrap px-[20px]">
                    <Button
                      variant="vanilla"
                      className="px-0 duration-300 hover:text-green-100"
                    >
                      <X size={16} />
                    </Button>
                    <Link
                      href={`${ROUTES.PRODUCTS}/${id}`}
                      className="aspect-square w-[53px] overflow-hidden rounded-[5px]"
                    >
                      <img src={imageUrl} alt={name} />
                    </Link>
                    <Link href={`${ROUTES.PRODUCTS}/${id}`}>{name}</Link>
                  </Table.Cell>
                  <Table.Cell data={price} />
                  <Table.Cell data={quantity} />
                  <Table.Cell data={total} />
                </Table.Row>
              );
            })}
        </Table.Body>
      </Table>
    </div>
  );
};

export default Products;
