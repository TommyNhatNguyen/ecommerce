import React from 'react'

type Props = {
  children: React.ReactNode;
}

const CustomTable = ({children, ...props}: Props) => {
  return (
    <div className="custom-table" {...props}>
      {children}
    </div>
  )
}

export default CustomTable