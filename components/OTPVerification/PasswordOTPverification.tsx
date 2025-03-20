"use client";

import { useState } from "react";

// clerk
import { useSignIn, useSignUp } from "@clerk/nextjs";

// icons
import { Lock, Eye, EyeClosed } from "lucide-react";

// zod
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// // router
// import { useRouter } from "next/navigation";

// components

import Button from "../Button/Button";
import { Input } from "../ui/input";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { toast } from "sonner";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  code: z.string().min(6, {
    message: "Your one-time code must be 6 characters.",
  }),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long.")
    .max(50, "Password cannot exceed 50 characters.")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
    .regex(/\d/, "Password must contain at least one number.")
    .regex(
      /[@$!%*?&]/,
      "Password must contain at least one special character (@, $, !, %, *, ?, &)."
    ),
});

const PasswordOTPverification = () => {
  // clerk hooks
  const { isLoaded, signIn, setActive } = useSignIn();
  const { signUp } = useSignUp();

  const router = useRouter();

  const [showResendBtn, setShowResendBtn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      password: "",
    },
  });

  const handleResendCode = () => {
    setSendingCode(true);
    return toast.promise(
      (async () => {
        await signUp?.prepareEmailAddressVerification({
          strategy: "email_code",
        });
        setSendingCode(false);
        setShowResendBtn(false);
      })(),
      {
        loading: "Resending code...",
        success: "Verification code successfully",
        error: "An error has occurred",
        position: "top-center",
      }
    );
  };

  const handleVerification = async (values: z.infer<typeof formSchema>) => {
    const { code, password } = values;

    if (!isLoaded) return;

    await signIn
      .attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      })
      .then((res) => {
        if (res.status === "complete") {
          setActive({ session: res.createdSessionId });
          toast.success("Password has been updated successfully");
          router.replace("/dashboard");
        }
      })
      .catch((error) => {
        if (error?.errors[0]?.code === "verification_expired") {
          setShowResendBtn(true);
          return toast("Vefication code Expired", {
            description: error?.errors[0]?.longMessage,
          });
        }

        toast("An error occurred", {
          description: JSON.stringify(error?.errors[0]?.longMessage, null, 2),
        });
        console.error("Error:", JSON.stringify(error, null, 2));
      });
  };

  const isLoading = form.formState.isSubmitting;

  return (
    <div>
      <div className="flex flex-col gap-y-4 w-full md:w-96">
        {/* header */}
        <div className="flex flex-col items-center mb-4">
          <div className="">
            <h2 className="text-xl text-center md:text-2xl font-medium font-poppins mb-1">
              Hello User
            </h2>
            <p className="text-sm font-barlow text-center dark:text-gray-400 text-gray-500">
              Let&apos;s get you back into your account
            </p>
          </div>
        </div>
        {/* header */}

        {/* form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleVerification)}>
            <div className="mb-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base  font-normal dark:text-white ">
                      Password reset Code
                    </FormLabel>

                    <FormControl className="w-full ">
                      <div className="">
                        <InputOTP maxLength={6} {...field} className="">
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                    </FormControl>
                    <FormMessage />
                    <FormDescription className="text-sm font-normal my-4  font-saira">
                      Please enter the code sent to the Email Address your
                      provided
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>

            <div className="mb-4">
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base  font-normal dark:text-white">
                      Create new Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                          <Lock size={20} />
                        </div>
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter new password"
                          disabled={isLoading}
                          className="w-full outline-0 ps-10  bg-light-200 dark:bg-dark-50 dark:text-white  placeholder:text-sm dark:border-0 rounded-sm placeholder:dark:text-gray-400"
                          {...field}
                        />
                        <div className="absolute inset-y-0 end-3 flex items-center ps-3.5 pointer-cursor">
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <Eye size={20} />
                            ) : (
                              <EyeClosed size={20} />
                            )}
                          </button>
                        </div>
                      </div>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {!showResendBtn && (
              <>
                <Button
                  isLoading={isLoading}
                  loadingText="Verifying.."
                  type="submit"
                  label="Submit"
                  style="dark:bg-white bg-dark-200 text-white dark:text-black font-semibold mt-4 hover:bg-primary-100"
                />
              </>
            )}
          </form>
        </Form>
        {/*  */}
      </div>

      {showResendBtn && (
        <div className="mt-2">
          <p className="text-sm dark:text-gray-400 text-gray-500 mb-2">
            Get new Code
          </p>
          <Button
            onClick={handleResendCode}
            type="button"
            label="Resend Code"
            isLoading={sendingCode}
            loadingText="Sending code..."
            style="mt-2 border dark:border-dark-10 border-gray-500"
          />
        </div>
      )}
    </div>
  );
};

export default PasswordOTPverification;
