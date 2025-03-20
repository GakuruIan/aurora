"use client";

// clerk
import { useSignUp } from "@clerk/nextjs";

// zod
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// router
import { useRouter } from "next/navigation";

// components

import Button from "../Button/Button";

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
import { useState } from "react";

const formSchema = z.object({
  code: z.string().min(6, {
    message: "Your one-time code must be 6 characters.",
  }),
});

const OTPverification = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [showResendBtn, setShowResendBtn] = useState(false);

  const [sendingCode, setSendingCode] = useState(false);

  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
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
    const { code } = values;

    if (!isLoaded) return;

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });

        // toaster
        toast.success("Success", {
          description: "Your account has being verified ",
        });

        // router
        router.push("/dashboard");
      } else {
        toast("An error occurred", {
          description: JSON.stringify(signUpAttempt, null, 2),
        });
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (error: unknown) {
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
    }
  };

  const isLoading = form.formState.isSubmitting;

  return (
    <div>
      <div className="flex flex-col gap-y-4 w-full md:w-96">
        {/* header */}
        <div className="flex flex-col items-center mb-4">
          <div className="">
            <h2 className="text-xl text-center md:text-2xl font-medium font-poppins mb-1">
              Welcome to Aurora
            </h2>
            <p className="text-sm font-barlow text-center dark:text-gray-400 text-gray-500">
              Finish up by verifying your account
            </p>
          </div>
        </div>
        {/* header */}

        {/* form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleVerification)} className="">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base  font-normal dark:text-white ">
                    Verification Code
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
                </FormItem>
              )}
            />

            {!showResendBtn && (
              <>
                <FormDescription className="text-sm font-normal my-4  font-saira">
                  Please enter the code sent to the Email Address your provided
                </FormDescription>

                <Button
                  isLoading={isLoading}
                  loadingText="Verifying.."
                  type="submit"
                  label="Verify"
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
            loadingText="Sending code"
            style="mt-2 border dark:border-dark-10 border-gray-500"
          />
        </div>
      )}
    </div>
  );
};

export default OTPverification;
