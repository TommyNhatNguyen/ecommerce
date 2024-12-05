import Button from "@/app/shared/components/Button";
import Form from "@/app/shared/components/Form";
import Table from "@/app/shared/components/Table";
import React from "react";

type ShipInfoPropsType = {
  handlePayment: () => void;
};

const ShipInfo = ({ handlePayment }: ShipInfoPropsType) => {
  const _onPayment = () => {
    handlePayment();
  };
  return (
    <section className="ship-info">
      <Table>
        <Table.Head>
          <Table.Row type="header">
            <Table.Cell type="header" colSpan={5} classes="text-left">
              Shipping
            </Table.Cell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Row type="data" classes="border-none">
            <Table.Cell
              type="cell"
              classes="flex items-start gap-[16px] justify-between ml-[-16px]"
            >
              <Form.Input
                label="First Name"
                error="error"
                isRequired={true}
                placeholder="First Name"
                wrapperClasses="border-none flex-1 w-full"
                inputClasses="h-input border border-solid border-gray-100 rounded-[10px] p-[10px] mt-[6px] ml-[-5px]"
              />
              <Form.Input
                label="Last Name"
                error="error"
                isRequired={true}
                placeholder="Last Name"
                wrapperClasses="border-none flex-1 w-full"
                inputClasses="h-input border border-solid border-gray-100 rounded-[10px] p-[10px] mt-[6px] ml-[-5px]"
              />
            </Table.Cell>
          </Table.Row>
          <Table.Row type="data" classes="border-none">
            <Table.Cell
              type="cell"
              classes="flex items-start gap-[16px] ml-[-16px]"
            >
              <Form.Input
                label="Email Address"
                error="error"
                isRequired={true}
                placeholder="Email Address"
                wrapperClasses="border-none flex-1"
                inputClasses="h-input border border-solid border-gray-100 rounded-[10px] p-[10px] mt-[6px] ml-[-5px]"
              />
              <Form.Input
                label="Phone Number"
                error="error"
                isRequired={true}
                placeholder="Phone Number"
                wrapperClasses="border-none flex-1"
                inputClasses="h-input border border-solid border-gray-100 rounded-[10px] p-[10px] mt-[6px] ml-[-5px]"
              />
            </Table.Cell>
          </Table.Row>
          <Table.Row type="data" classes="border-none">
            <Table.Cell type="cell">
              <Form.Input
                label="Street Address"
                error="error"
                isRequired={true}
                placeholder="Street Address"
                wrapperClasses="border-none flex-1"
                inputClasses="h-input border border-solid border-gray-100 rounded-[10px] p-[10px] mt-[6px] ml-[-5px]"
              />
            </Table.Cell>
          </Table.Row>
          <Table.Row type="data" classes="border-none">
            <Table.Cell type="cell">
              <Form.Input
                label="Town / City"
                error="error"
                placeholder="Town / City"
                wrapperClasses="border-none flex-1"
                inputClasses="h-input border border-solid border-gray-100 rounded-[10px] p-[10px] mt-[6px] ml-[-5px]"
              />
            </Table.Cell>
          </Table.Row>
        </Table.Body>
        <Table.Footer classes="border-none">
          <Table.Cell type="cell">
            <Button variant="accent-1" onClick={_onPayment}>
              Proceed to Payment
            </Button>
          </Table.Cell>
        </Table.Footer>
      </Table>
    </section>
  );
};

export default ShipInfo;
