"use client";
import InputAdmin from "@/app/shared/components/InputAdmin";
import { Button, Checkbox, Divider } from "antd";
import Password from "antd/es/input/Password";
import { Lock, LogIn, User } from "lucide-react";
import Link from "next/link";
import React from "react";
import facebookLogo from "@/app/shared/resources/images/facebook-logo.png";
import googleLogo from "@/app/shared/resources/images/google-logo.png";
import Image from "next/image";
import { ADMIN_ROUTES } from "@/app/constants/routes";
import { Controller, useForm } from "react-hook-form";
import { useLogin } from "@/app/(dashboard)/admin/(auth)/login/hooks/useLogin";
import { ERROR_MESSAGE } from "@/app/constants/errors";
import { LoginDTO } from "@/app/shared/interfaces/auth/auth.dto";
type LoginPagePropsType = {};

const LoginPage = ({}: LoginPagePropsType) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { handleLogin } = useLogin();
  const _onLogin = (data: any) => {
    handleLogin(data);
  };
  return (
    <div className="flex h-full w-full flex-col justify-center p-4">
      <div className="flex w-full flex-col gap-2">
        <Controller
          control={control}
          name="username"
          rules={{
            required: {
              value: true,
              message: ERROR_MESSAGE.REQUIRED,
            },
          }}
          render={({ field }) => (
            <InputAdmin
              prefix={<User />}
              error={errors?.username?.message as string}
              required={true}
              label="Username"
              placeholder="Enter username"
              {...field}
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          rules={{
            required: {
              value: true,
              message: ERROR_MESSAGE.REQUIRED,
            },
          }}
          render={({ field }) => (
            <InputAdmin
              prefix={<Lock />}
              error={errors?.password?.message as string}
              required={true}
              label="Password"
              placeholder="Enter password"
              {...field}
              customComponent={(props, ref: any) => {
                return <Password {...props} ref={ref} />;
              }}
            />
          )}
        />
      </div>
      <div className="mt-4 w-full">
        <Controller
          control={control}
          name="isRemember"
          rules={{
            required: {
              value: true,
              message: ERROR_MESSAGE.REQUIRED,
            },
          }}
          render={({ field }) => (
            <InputAdmin
              label="Remember me"
              placeholder="Remember me"
              {...field}
              error={errors?.isRemember?.message as string}
              customComponent={(props, ref: any) => (
                <Checkbox {...props} ref={ref} checked={field.value}>
                  Agree with the{" "}
                  <Link href="/" className="underline">
                    terms and conditions
                  </Link>
                </Checkbox>
              )}
            />
          )}
        />
      </div>
      <div className="mt-4 flex w-full flex-col gap-4">
        <Button
          type="primary"
          className="w-full"
          onClick={handleSubmit(_onLogin)}
        >
          <LogIn className="h-4 w-4" />
          Login
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
        Need an account?
        <Link
          href={ADMIN_ROUTES.register}
          className="font-bold uppercase text-blue-600 underline"
        >
          SIGN UP
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
