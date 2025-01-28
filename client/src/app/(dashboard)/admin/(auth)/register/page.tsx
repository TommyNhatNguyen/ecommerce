import { ADMIN_ROUTES } from "@/app/constants/routes";
import { Divider } from "antd";
import Password from "antd/es/input/Password";
import InputAdmin from "@/app/shared/components/InputAdmin";
import React from "react";
import { Button } from "antd";
import Image from "next/image";
import facebookLogo from "@/app/shared/resources/images/facebook-logo.png";
import googleLogo from "@/app/shared/resources/images/google-logo.png";
import Link from "next/link";
import { useForm } from "react-hook-form";
type Props = {};

const RegisterPage = (props: Props) => {
  const { register, handleSubmit } = useForm();
  return (
    <div className="flex h-full w-full flex-col justify-center p-4">
      <div className="flex w-full flex-col gap-2">
        <InputAdmin
          required={true}
          label="Username"
          placeholder="Enter username"
        />
        <InputAdmin
          required={true}
          label="Password"
          placeholder="Enter password"
          customComponent={(props, ref: any) => {
            return <Password {...props} ref={ref} />;
          }}
        />
      </div>
      <div className="mt-4 flex w-full flex-col gap-4">
        <Button type="primary" className="w-full">
          Register
        </Button>
      </div>
      <div className="flex w-full flex-col">
        <Divider>Or login with</Divider>
        <div className="flex w-full flex-col gap-2">
          <Button
            variant="outlined"
            className="flex w-full items-center gap-2 py-1"
          >
            <Image
              src={googleLogo}
              alt="Google"
              width={36}
              height={36}
              className="w-fit object-contain object-center"
            />
            Login with Google
          </Button>
          <Button
            variant="outlined"
            className="flex w-full items-center gap-2 py-1"
          >
            <Image
              src={facebookLogo}
              alt="Facebook"
              width={36}
              height={36}
              className="w-fit object-contain object-center"
            />
            Login with Facebook
          </Button>
        </div>
      </div>
      <div className="mt-5 flex w-full items-center justify-center gap-2">
        Already have an account?
        <Link
          href={ADMIN_ROUTES.login}
          className="font-bold uppercase text-blue-600 underline"
        >
          LOGIN
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;
