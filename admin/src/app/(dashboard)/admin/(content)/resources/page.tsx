"use client";
import { ImageType } from "@/app/shared/interfaces/image/image.dto";
import { IMAGE_TYPE } from "@/app/constants/imageType";
import { imagesService } from "@/app/shared/services/images/imagesService";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Button, Card, Checkbox, CheckboxChangeEvent, Image } from "antd";
import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useResources } from "@/app/(dashboard)/admin/(content)/resources/hooks/useResources";
import { Trash2 } from "lucide-react";

type Props = {};

export default function ResourcesPage() {
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "100px 0px",
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
    isFetching,
  } = useInfiniteQuery({
    queryKey: ["images", checkedList],
    queryFn: (p) =>
      imagesService.getImages({
        page: p.pageParam,
        limit: 12,
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
    if (inView && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetching]);

  useEffect(() => {
    // Trigger initial load if there's not enough content
    if (
      (imageData?.pages[0]?.data.length || 0) < 12 &&
      hasNextPage &&
      !isFetching
    ) {
      fetchNextPage();
    }
  }, [imageData?.pages, hasNextPage, isFetching]);
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
      <div className="grid h-full flex-1 grid-cols-2 gap-4 overflow-y-auto sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {imageData?.pages.map((page) => {
          return page.data.map((image, index) => {
            const isLastItem = index === page.data.length - 1;
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
                className={`p-2 ${isLastItem ? "relative" : ""}`}
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
                {isLastItem && (
                  <div
                    ref={ref}
                    className="absolute bottom-0 right-0 h-4 w-full"
                  ></div>
                )}
              </Card>
            );
          });
        })}
        {hasNextPage && (
          <div className="col-span-full flex justify-center py-4">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        )}
      </div>
    </div>
  );
}
