"use client";
import React, { useRef, useState } from "react";
import GeneralModal from "../GeneralModal";
import { ModalType } from "../Header/components/Cta";
import { Tabs, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { TabsList } from "@radix-ui/react-tabs";
import Form from "../Form";
import { useForm } from "react-hook-form";
import { CustomerLoginDTO } from "../../interfaces/customers/customers.dto";
import Button from "../Button";
import { ERROR_MESSAGE } from "@/app/constants/errors";
import facebookLogo from "@/app/shared/resources/images/facebook-logo.png";
import { Eye, EyeClosed, Mail, Phone } from "lucide-react";
import { useLogin } from "./hooks/useLogin";
import { useToast } from "@/hooks/use-toast";

type Props = {
  showModal: ModalType | null;
  onCancel: () => void;
  onModalChange: (value: ModalType) => void
};

const AuthModal = ({ showModal, onCancel,onModalChange, ...props }: Props) => {

  const { handleLogin } = useLogin();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<CustomerLoginDTO>({});
  const _onCloseModal = () => {
    onCancel();
  };
  const _onLogin = async (data: CustomerLoginDTO) => {
    await handleLogin(data, _onCloseModal);
    
  };
  const _onModalChange = (value: string) => {
    onModalChange(value as ModalType);
  };
  const _renderBody = () => {
    return (
      <Tabs
        value={showModal as string}
        className="mt-10 w-full"
        onValueChange={(value) => _onModalChange(value)}
      >
        <TabsList className="grid min-h-[50px] w-full grid-cols-2 rounded-md bg-neutral-400/20 p-2">
          <TabsTrigger value={ModalType.LOGIN}>Login</TabsTrigger>
          <TabsTrigger value={ModalType.REGISTER}>Register</TabsTrigger>
        </TabsList>
        <div className="mt-4 min-h-[250px] rounded-md border border-solid border-bg-primary-60 p-4">
          <TabsContent value={ModalType.LOGIN}>
            <Form.Input
              {...register("username", {
                required: {
                  value: true,
                  message: ERROR_MESSAGE.USERNAME_REQUIRE,
                },
              })}
              label="Username"
              error={errors?.username?.message || ""}
              isRequired={true}
              placeholder="Enter username"
              wrapperClasses="border-none flex-1 w-full"
              inputClasses="h-input border border-solid border-gray-100 rounded-[10px] p-[10px] mt-2"
              labelClasses="font-roboto-medium"
            />
            <Form.Input
              {...register("password", {
                required: {
                  value: true,
                  message: ERROR_MESSAGE.PASSWORD_REQUIRE,
                },
              })}
              type="password"
              label="Password"
              error={errors?.password?.message || ""}
              isRequired={true}
              placeholder="Enter password"
              wrapperClasses="border-none flex-1 w-full mt-4"
              inputClasses="h-input border border-solid border-gray-100 rounded-[10px] p-[10px] mt-2"
              labelClasses="font-roboto-medium"
            />
            <Button
              onClick={handleSubmit(_onLogin)}
              variant="accent-1"
              classes="mx-auto w-full mt-6"
            >
              Login
            </Button>
            <div className="my-6 flex items-center gap-2">
              <div className="block h-1 w-full bg-bg-primary-60"></div>
              <span className="whitespace-nowrap text-nowrap">
                Or login with
              </span>
              <div className="block h-1 w-full bg-bg-primary-60"></div>
            </div>
            <div className="flex w-full flex-col gap-4">
              <Button
                variant="vanilla"
                isDisabled={true}
                classes="w-full border border-solid border-green-300 hover:opacity-60 duration-300"
              >
                Login with Google (Comming soon)
              </Button>
              <Button
                variant="vanilla"
                isDisabled={true}
                classes="w-full border border-solid border-green-300 hover:opacity-60 duration-300"
              >
                Login with Facebook (Comming soon)
              </Button>
              <Button
                variant="vanilla"
                isDisabled={true}
                classes="w-full border border-solid border-green-300 hover:opacity-60 duration-300"
              >
                <Phone className="h-8 w-8" />
                Login with Phone (Comming soon)
              </Button>
              <Button
                variant="vanilla"
                isDisabled={true}
                classes="w-full border border-solid border-green-300 hover:opacity-60 duration-300"
              >
                <Mail className="h-8 w-8" />
                Login with Email (Comming soon)
              </Button>
            </div>
          </TabsContent>
          <TabsContent value={ModalType.REGISTER}>
            <div>Register</div>
            <div>username</div>
            <div>password</div>
            <div>confirm password</div>
            <div>check privacy and condition</div>
            <div>Submit</div>
          </TabsContent>
        </div>
      </Tabs>
    );
  };
  const _renderFooter = () => {
    return (
      <div className="w-full text-center">
        {showModal === ModalType.LOGIN ? (
          <p>
            Haven't got an account?{" "}
            <a
              className="text-blue-link underline hover:underline"
              onClick={() => _onModalChange(ModalType.REGISTER)}
            >
              Sign up
            </a>{" "}
            to get many discounts ahead!
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <a
              className="text-blue-link underline hover:underline"
              onClick={() => _onModalChange(ModalType.LOGIN)}
            >
              Sign in
            </a>{" "}
            to explore more!
          </p>
        )}
      </div>
    );
  };
  return (
    <GeneralModal
      open={!!showModal}
      renderContent={_renderBody}
      renderFooter={_renderFooter}
      onCancel={_onCloseModal}
      className={"min-w-[0px] max-w-[500px]"}
    />
  );
};

export default AuthModal;
