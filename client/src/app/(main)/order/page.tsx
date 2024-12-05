import OrderList from "@/app/(main)/order/(components)/OrderList";
import Container from "@/app/shared/components/Container";
import Titlegroup from "@/app/shared/components/Titlegroup";
import React from "react";

type Props = {};

const OrderPage = (props: Props) => {
  return (
    <main id="order" className="order py-section">
      <Container>
        <Titlegroup> 
          <Titlegroup.Title>
            Order History
          </Titlegroup.Title>
          <Titlegroup.Description>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit tenetur sunt dignissimos. Sed natus doloribus enim, ex, architecto repellendus, doloremque totam molestias quasi consequuntur nam! Odio beatae sit doloribus fugiat.
          </Titlegroup.Description>
        </Titlegroup>
        <OrderList/>
      </Container>
    </main>
  );
};

export default OrderPage;
