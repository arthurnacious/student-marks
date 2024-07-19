"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import Separator from "@/components/ui/separator";
import { FaGithub, FaGoogle } from "react-icons/fa6";

const formSchema = z.object({
  email: z.string().email("Email needs to be a valid email."),
  password: z.string().min(2, {
    message: "Password must be at least 2 characters long.",
  }),
});

const LoginForm = () => {
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <div className="w-2/3 flex flex-col items-center justify-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5 flex flex-col w-full"
        >
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-neutral-950">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Email"
                      className="bg-white/20 backdrop-blur-sm text-gray-800 p-6 rounded-2xl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-neutral-950">Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="******"
                      className="bg-white/20 backdrop-blur-sm text-gray-800 p-6 rounded-2xl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" className="p-6 rounded-3xl" isLoading={false}>
            Submit
          </Button>
          <div className="flex flex-col items-center justify-center">
            <Separator />
            <span className="text-neutral-950">Or</span>
          </div>
          <div className="flex flex-col items-center justify-center w-full space-y-2">
            <Button className="flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-xl shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <FaGoogle className="size-4 mr-2 text-black" />
              <span className="text-gray-700 font-medium">
                Sign in with Google
              </span>
            </Button>

            <Button className="flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-xl shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <FaGithub className="size-4 mr-2 text-black" />
              <span className="text-gray-700 font-medium">
                Sign in with GitHub
              </span>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;
