import CartDetails from '@/app/(main)/checkout/(components)/CartDetails'
import ShipInfo from '@/app/(main)/checkout/(components)/ShipInfo'
import Container from '@/app/shared/components/Container'
import React from 'react'

type Props = {}

const CheckoutPage = (props: Props) => {
  return (
    <main id="checkout" className="checkout py-section">
      <Container>
        <div className="grid grid-cols-[1.45fr,1fr] gap-gutter items-start justify-between">
        <ShipInfo/>
        <CartDetails/>
        </div>
      </Container>
    </main>
  )
}

export default CheckoutPage