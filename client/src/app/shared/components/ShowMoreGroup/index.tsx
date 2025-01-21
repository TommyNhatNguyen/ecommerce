import { Button } from 'antd';
import { EyeIcon } from 'lucide-react';
import { EyeClosedIcon } from 'lucide-react';
import React, { useState } from 'react'

type ShowMoreGroupPropsType = {
  children: React.ReactNode;
}

const ShowMoreGroup = ({children}: ShowMoreGroupPropsType) => {
  const [isShowMore, setIsShowMore] = useState(false);
  const _onShowMore = () => {
    setIsShowMore(true);
  };
  const _onHideShowMore = () => {
    setIsShowMore(false);
  };
  return (
    <>
      {isShowMore ? (
        <Button 
          type="link"
          onClick={_onHideShowMore}
          className="self-start p-0 italic"
        >
          <EyeClosedIcon className="h-4 w-4" />
          Show less
        </Button>
      ) : (
        <Button
          type="link"
          onClick={_onShowMore}
          className="self-start p-0 italic"
        >
          <EyeIcon className="h-4 w-4" />
          Show more
        </Button>
      )}
      {isShowMore && children}
    </>
  );
};

export default ShowMoreGroup;