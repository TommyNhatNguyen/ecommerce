
import React from 'react'

type Props = {}

const WebsitePage = (props: Props) => {
  return (
    <div>
      <iframe
  src="http://localhost:1337/admin"
  style={{ width: '100%', height: '100vh', border: 'none' }}
/>
    </div>
  )
}

export default WebsitePage