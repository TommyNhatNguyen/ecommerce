import Billing from "@/app/(main)/profile/(components)/Billing";
import OrderUpcoming from "@/app/(main)/profile/(components)/OrderUpcoming";
import Container from "@/app/shared/components/Container";
import Titlegroup from "@/app/shared/components/Titlegroup";

import React from "react";

type Props = {};

const ProfilePage = (props: Props) => {
  return (
    <main id="profile" className="profile py-section">
      <Container>
        <Titlegroup>
          <Titlegroup.Title>Profile</Titlegroup.Title>
          <Titlegroup.Description>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque id
            autem iure, cum, incidunt praesentium repudiandae quam fuga alias ut
            et tempora quas qui, labore tenetur nobis aliquam eaque dignissimos!
          </Titlegroup.Description>
        </Titlegroup>
        <OrderUpcoming />
        <Billing />
      </Container>
    </main>
  );
};

export default ProfilePage;
