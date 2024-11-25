import { ROUTES } from "@/app/constants/routes";
import { ButtonWithLink } from "@/app/shared/components/Button";
import { CardBlog } from "@/app/shared/components/Card";
import Container from "@/app/shared/components/Container";
import Titlegroup from "@/app/shared/components/Titlegroup";
import { ChevronRightIcon } from "lucide-react";
import React from "react";
import mockBlogImage from "../../../../resources/images/homepage/blog-thumb.jpg";
import mockUserAvatar from "../../../../resources/images/homepage/blog-thumb.jpg";

type Props = {};

const blogs = [
  {
    blogTitle: "Blog 1",
    authorName: "John Doe",
    createdAt: "2021-01-01",
    userAvatarUrl: mockUserAvatar,
    link: ROUTES.BLOG,
    imgUrl: mockBlogImage,
  },
  {
    blogTitle: "Blog 2",
    authorName: "Jane Smith",
    createdAt: "2021-02-15",
    userAvatarUrl: mockUserAvatar,
    link: ROUTES.BLOG,
    imgUrl: mockBlogImage,
  },
  {
    blogTitle: "Blog 3",
    authorName: "Alice Johnson",
    createdAt: "2021-03-10",
    userAvatarUrl: mockUserAvatar,
    link: ROUTES.BLOG,
    imgUrl: mockBlogImage,
  },
  {
    blogTitle: "Blog 4",
    authorName: "Bob Brown",
    createdAt: "2021-04-20",
    userAvatarUrl: mockUserAvatar,
    link: ROUTES.BLOG,
    imgUrl: mockBlogImage,
  },
];

const BlogSection = (props: Props) => {
  return (
    <section id="blog" className="blog mt-section">
      <Container>
        <Titlegroup classes="product__title flex items-center justify-between gap-gutter">
          <Titlegroup.Info classes="max-w-[50%]">
            <Titlegroup.Title>Latest Ongoings</Titlegroup.Title>
            <Titlegroup.Description classes="mt-[16px]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
              fringilla nunc in molestie feugiat. Nunc auctor consectetur elit,
              quis pulvinar.
            </Titlegroup.Description>
          </Titlegroup.Info>
          <ButtonWithLink
            link={ROUTES.BLOG}
            classes="h-btn px-[24px] text-center text-white text-primary-btn rounded-[64px] bg-pink-200 hover:bg-pink-100 duration-300 flex items-center justify-center gap-2"
          >
            <span className="h-full content-center text-nowrap">
              Read All Blogs
            </span>
            <ChevronRightIcon
              width={20}
              height={20}
              className="h-full content-center text-nowrap"
            />
          </ButtonWithLink>
        </Titlegroup>
        <div className="blog__cards mt-[36px] flex items-center justify-between gap-gutter">
          {blogs.map((blog, index) => {
            return <CardBlog key={index} {...blog} />;
          })}
        </div>
      </Container>
    </section>
  );
};

export default BlogSection;
