import React from 'react'

type Props = {}

const Description = (props: Props) => {
  return (
    <div className="content__description text-white">
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Lorem ipsum dolor sit amet, consectetur adipisicing
        elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
        ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet,
        consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore
        et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
        exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      </p>
      <ul className="mt-[16px] list-disc list-inside">
        <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit</li>
        <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit</li>
        <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit</li>
        <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit</li>
      </ul>
    </div>
  );
}

export default Description