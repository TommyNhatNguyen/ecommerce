import clsx from "clsx";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";

type BreadcrumbPropsType = {
  children: React.ReactNode;
  classes?: string;
};

const Breadcrumb = ({ children, classes }: BreadcrumbPropsType) => {
  return (
    <div className={clsx("breadcrumb", "flex items-center gap-[6px]", classes)}>
      {React.Children.map(children, (child, index) => {
        const isLastItem = index === React.Children.count(children) - 1;
        return (
          <div
            className={clsx(
              "breadcrumb__item",
              "flex items-center gap-[6px]",
              isLastItem && "font-roboto-medium text-green-300",
            )}
            key={index}
          >
            {child}
            {!isLastItem && <ChevronRight width={20} height={20} />}
          </div>
        );
      })}
    </div>
  );
};

type BreadcrumbItemPropsType = {
  children: React.ReactNode;
  classes?: string;
};

Breadcrumb.Item = ({ children, classes }: BreadcrumbItemPropsType) => {
  return <p className={clsx("breadcrumb__item-text", classes)}>{children}</p>;
};

type BreadcrumbLinkPropsType = BreadcrumbItemPropsType & {
  link: string;
};

Breadcrumb.Link = ({ children, classes, link }: BreadcrumbLinkPropsType) => {
  return (
    <Link href={link} className={clsx("breadcrumb__item-link", classes)}>
      {children}
    </Link>
  );
};

export default Breadcrumb;
