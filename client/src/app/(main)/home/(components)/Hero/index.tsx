import React from "react";
import heroImage from "@/app/shared/resources/images/homepage/hero-banner.jpg";
import { Search } from "lucide-react";
import Form from "@/app/shared/components/Form";
import Button from "@/app/shared/components/Button";
import Image from "next/image";

const Hero = () => {
  return (
    <div className="main__hero relative mt-header h-[100vh] max-h-[960px] min-h-[800px] w-full overflow-hidden">
      <Image
        src={heroImage}
        alt="hero"
        width={1920}
        height={960}
        className="h-full w-full object-cover"
      />
      <div className="main__info absolute left-[50%] top-[50%] w-full max-w-[861px] -translate-x-[50%] -translate-y-[50%] rounded-2xl bg-bg-primary-70 p-[32px] shadow-md backdrop-blur-md">
        <h1 className="main__info-title text-center font-playright-bold text-h1 text-green-200">
          Crafting Comfort, Redefining Spaces. Your Signature Style!
        </h1>
        <div className="main__info-content mx-auto mt-[32px] max-w-[80%]">
          <p className="desc text-center text-body-big">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
            fringilla nunc in molestie feugiat. Nunc auctor consectetur elit,
            quis pulvina. Lorem ipsum dolor sit amet, consectetur adipiscing
            elit. Nulla fringilla nunc in molestie feugiat
          </p>
          <Form className="mx-auto mt-[32px] max-w-[344px]">
            <Form.Input
              wrapperClasses="h-input rounded-[42px] border-bg-secondary bg-bg-primary-60 flex items-center justify-between pl-[20px] pr-[10px] py-[10px] hover:border-bg-primary-70 duration-300 focus-within:border-bg-primary-70 gap-[8px]"
              renderIcon={() => (
                <Button className="from__group-icon flex aspect-square h-[40px] items-center justify-center rounded-full bg-green-300 duration-300 hover:bg-green-200">
                  <Search className="text-white" width={18} height={18} />
                </Button>
              )}
              placeholder="Search An Item"
            />
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Hero;
