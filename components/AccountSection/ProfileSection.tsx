"use client";

import React, { useEffect } from "react";

import { ClerkUser } from "@/interfaces";

interface props {
  user: ClerkUser;
}

// image
import Image from "next/image";

// form
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// components
import { Input } from "../ui/input";

import { Separator } from "../ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "../ui/button";

// default
import fallback from "@/public/fallback.png";
import { toast } from "sonner";

const formSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long.")
    .max(20, "username cannot be more than 20 characters")
    .regex(
      /^[a-zA-Z][a-zA-Z0-9_]*$/,
      "Username must start with a letter and contain only letters, numbers, and underscores."
    ),

  imageUrl: z
    .any()
    .optional()
    .refine(
      (file) => !file || (file instanceof File && file.size <= 2000000),
      "File size must be less than 2MB"
    )
    .refine(
      (file) =>
        !file ||
        (file instanceof File &&
          ["image/jpeg", "image/png", "image/gif"].includes(file.type)),
      "Only JPEG, PNG and GIF files are allowed"
    ),
});

const ProfileSection: React.FC<props> = ({ user }) => {
  const { username, imageUrl, emailAddresses } = user;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageUrl: null,
      username: "",
    },
  });

  // Watch the file
  const imageFile = form.watch("imageUrl");
  const formWatch = form.watch(["username"]);

  useEffect(() => {
    if (username && emailAddresses[0].emailAddress) {
      form.setValue("username", username);
    }
  }, [form, username, emailAddresses]);

  useEffect(() => {
    return () => {
      if (imageFile instanceof File) {
        URL.revokeObjectURL(URL.createObjectURL(imageFile));
      }
    };
  }, [imageFile]);

  const handleUpload = async () => {
    return toast.promise(
      (async () => {
        try {
          if (user && form.getValues("imageUrl")) {
            const file = form.getValues("imageUrl");

            if (!file || !(file instanceof File)) {
              throw new Error("Invalid file");
            }

            const ImageResource = await user.setProfileImage({
              file: file,
            });

            if (!ImageResource) {
              throw new Error("Error in uploading file");
            }

            return ImageResource; // Return for promise handling
          }
        } catch (error) {
          console.error("Upload error:", error);
          throw error; // Re-throw for toast error handling
        }
      })(),
      {
        loading: "Uploading photo...",
        success: "Photo uploaded successfully",
        error: "An error has occurred",
        position: "top-center",
      }
    );
  };

  // form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { username } = values;

    return toast.promise(
      (async () => {
        try {
          if (username && username !== user.username) {
            // Update username if it has changed
            await user.update({
              username,
            });

            console.log("Changed username");
          }
        } catch (error) {
          console.error("Upload error:", error);
          throw error; // Re-throw for toast error handling
        }
      })(),
      {
        loading: "Saving your information...",
        success: "information saved successfully",
        error: "An error has occurred",
        position: "top-center",
      }
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="">
          <h1 className="text-base font-poppins mb-2">Personal Information</h1>
          <Separator />
          <div className="mt-4 px-2 border dark:border-dark-10 border-gray-500 rounded-md py-4">
            <h6 className="text-base mb-3">Profile Image</h6>
            <div className="mb-4 flex items-center gap-x-4">
              <div className="">
                <FormField
                  name="imageUrl"
                  control={form.control}
                  render={({ field: { value, ref, onChange, ...props } }) => (
                    <FormItem className="flex items-center gap-x-2">
                      <div className="size-16 rounded-full overflow-hidden">
                        <Image
                          src={
                            value
                              ? URL.createObjectURL(value) // If a new file is selected, create a preview URL
                              : imageUrl || fallback
                          }
                          alt="profile image"
                          width={24}
                          height={24}
                          className="h-full w-full"
                        />
                      </div>
                      <div className="">
                        {imageFile ? (
                          <div className="flex items-center gap-x-2">
                            {/* upload button */}
                            <Button type="button" onClick={handleUpload}>
                              Upload
                            </Button>

                            {/* reset the image input */}
                            <Button
                              onClick={() => form.resetField("imageUrl")}
                              type="button"
                              className="bg-rose-600 text-white  hover:bg-rose-500"
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          // show select input
                          <>
                            <FormLabel>Change profile photo</FormLabel>

                            <FormControl>
                              <Input
                                type="file"
                                accept="image/*"
                                className="mt-2"
                                ref={ref}
                                placeholder="dev one"
                                onChange={(e) => {
                                  const file = e.target.files?.[0] || null;
                                  onChange(file);
                                }}
                                {...props}
                              />
                            </FormControl>

                            <FormMessage />
                            <span className="text-gray-400 text-sm">
                              Recommend size 1:1, up to 2mb
                            </span>
                          </>
                        )}
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* username  */}
            <div className="mb-4">
              <FormField
                name="username"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        className="mt-2"
                        placeholder="username"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* check if field is touched */}
            {formWatch && form.formState.dirtyFields.username && (
              <div className="flex items-center justify-end gap-x-2">
                <Button
                  onClick={() => {
                    form.resetField("username");
                    form.setValue("username", username);
                  }}
                  variant="outline"
                  type="button"
                  className=""
                >
                  Discard,Changes
                </Button>
                <Button type="submit">Save</Button>
              </div>
            )}
          </div>
        </div>
      </form>
    </Form>
  );
};

export default ProfileSection;
