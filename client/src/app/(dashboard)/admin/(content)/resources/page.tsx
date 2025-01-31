"use client";
import { ImageType } from "@/app/shared/interfaces/image/image.dto";
import { IMAGE_TYPE } from "@/app/constants/imageType";
import { imagesService } from "@/app/shared/services/images/imagesService";
import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import {
  Button,
  Card,
  Checkbox,
  CheckboxChangeEvent,
  CheckboxProps,
  Image,
} from "antd";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useResources } from "@/app/(dashboard)/admin/(content)/resources/hooks/useResources";
import { Trash2 } from "lucide-react";

type Props = {};

export default function ResourcesPage() {
  const { ref, inView } = useInView({
    threshold: 0,
  });
  const {
    checkedList,
    checkAll,
    indeterminate,
    handleCheckAllChange,
    handleChangeCheckedList,
    handleDeleteImage,
    deleteImageLoading,
  } = useResources();
  const _onChangeCheckedList = (e: ImageType[]) => {
    handleChangeCheckedList(e);
  };
  const _onCheckAll = (e: CheckboxChangeEvent) => {
    handleCheckAllChange(e);
  };
  const {
    data: imageData,
    fetchNextPage,
    hasNextPage,
    refetch,
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
  const _onDeleteImage = (id: string) => {
    handleDeleteImage(id, () => {
      refetch();
    });
  };
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage]);
  return (
    <div className="flex h-full items-start gap-2">
      <div className="flex h-full flex-col gap-1 rounded-md bg-white p-2">
        <h3 className="text-lg font-medium">Type of resources</h3>
        <Checkbox
          indeterminate={indeterminate}
          onChange={_onCheckAll}
          checked={checkAll}
        >
          All
        </Checkbox>
        <Checkbox.Group
          className="flex flex-col gap-1"
          options={Object.values(
            IMAGE_TYPE as { [key: string]: ImageType },
          ).map((type) => ({
            label: type,
            value: type,
          }))}
          value={checkedList}
          onChange={_onChangeCheckedList}
        />
      </div>
      <div className="grid h-full flex-1 grid-cols-3 gap-4 overflow-y-auto">
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
                    <div className="flex items-center justify-between">
                      <h3 className="text-md font-medium capitalize">
                        {image.type}
                      </h3>
                      <Button
                        type="text"
                        icon={<Trash2 className="h-4 w-4 text-red-500" />}
                        onClick={() => _onDeleteImage(image.id)}
                        loading={deleteImageLoading}
                      />
                    </div>
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
                <div className="flex items-center justify-between">
                  <h3 className="text-md font-medium capitalize">
                    {image.type}
                  </h3>
                  <Button
                    type="text"
                    icon={<Trash2 className="h-4 w-4 text-red-500" />}
                    onClick={() => _onDeleteImage(image.id)}
                    loading={deleteImageLoading}
                  />
                </div>
              </Card>
            );
          });
        })}
      </div>
    </div>
  );
}
