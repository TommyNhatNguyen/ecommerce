"use client";
import { ImageType } from "@/app/shared/interfaces/image/image.dto";
import { IMAGE_TYPE } from "@/app/constants/imageType";
import { imagesService } from "@/app/shared/services/images/imagesService";
import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import { Button, Card, Checkbox, CheckboxProps, Image } from "antd";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

type Props = {};

export default function ResourcesPage() {
  const { ref, inView } = useInView({
    threshold: 0,
  });
  const [checkedList, setCheckedList] = useState<ImageType[]>([]);
  const {
    data: imageData,
    fetchNextPage,
    hasNextPage,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ["images", checkedList],
    queryFn: (p) =>
      imagesService.getImages({
        page: p.pageParam,
        limit: 3,
        typeList: checkedList,
      }),
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.current_page === lastPage.meta.total_page) {
        return undefined;
      }
      return lastPage.meta.current_page + 1;
    },
    initialPageParam: 1,
  });
  const checkAll = Object.values(IMAGE_TYPE).length === checkedList.length;
  const indeterminate =
    checkedList.length > 0 &&
    checkedList.length < Object.values(IMAGE_TYPE).length;
  const onCheckAllChange: CheckboxProps["onChange"] = (e) => {
    setCheckedList(
      e.target.checked
        ? (Object.values(IMAGE_TYPE) as ImageType[])
        : ([] as ImageType[]),
    );
  };
  const onCheckedListChange: CheckboxProps["onChange"] = (
    value: ImageType[],
  ) => {
    setCheckedList(value);
  };
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage]);
  return (
    <div className="h-full">
      <div>
        <Checkbox
          indeterminate={indeterminate}
          onChange={onCheckAllChange}
          checked={checkAll}
        >
          All
        </Checkbox>
        <Checkbox.Group
          options={Object.values(
            IMAGE_TYPE as { [key: string]: ImageType },
          ).map((type) => ({
            label: type,
            value: type,
          }))}
          value={checkedList}
          onChange={(checkValue: ImageType[]) =>
            onCheckedListChange(checkValue)
          }
        />
      </div>
      <div className="grid h-full max-h-[70%] grid-cols-3 gap-4 overflow-y-auto">
        {imageData?.pages.map((page) => {
          return page.data.map((image, index) => {
            if (index === page.data.length - 1) {
              return (
                <>
                  <Card
                    hoverable
                    key={image.id}
                    cover={
                      <Image
                        className="max-h-[200px] min-h-[200px] object-contain"
                        src={image.url}
                        alt={image.id}
                      />
                    }
                    className="relative p-2"
                  >
                    <Card.Meta title={image.type} />
                    <div ref={ref} className="absolute bottom-0 right-0"></div>
                  </Card>
                </>
              );
            }
            return (
              <Card
                hoverable
                key={image.id}
                cover={
                  <Image
                    className="max-h-[200px] min-h-[200px] object-contain"
                    src={image.url}
                    alt={image.id}
                  />
                }
                className="p-2"
              >
                <Card.Meta title={image.type} />
              </Card>
            );
          });
        })}
      </div>
    </div>
  );
}
