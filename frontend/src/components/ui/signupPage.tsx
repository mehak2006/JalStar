"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import Header from "@/components/ui/header";
const signupSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
import Footer from "@/components/ui/footer";
export default function SignupPage() {
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof signupSchema>) {
    console.log("Signup values:", values);
  }

  return (
    <>
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-sky-100 via-blue-200 to-sky-300 p-6 relative overflow-hidden">
      {/* Animated water-like blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-sky-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-bounce" />

      {/* Signup card */}
      <div className="w-full max-w-lg rounded-3xl bg-white/40 backdrop-blur-lg shadow-2xl p-10 border border-white/50">
        <h2 className="mb-3 text-center text-4xl font-extrabold text-blue-900 drop-shadow-sm">
           Welcome to Jalsthar
        </h2>
        <p className="mb-8 text-center text-base text-blue-700">
          Create your account and dive into the flow 
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-blue-800 font-medium">
                    Full Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      className="rounded-xl border-2 border-blue-200 focus:border-sky-500 focus:ring focus:ring-sky-200 transition bg-white/70"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-blue-800 font-medium">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="you@example.com"
                      className="rounded-xl border-2 border-blue-200 focus:border-sky-500 focus:ring focus:ring-sky-200 transition bg-white/70"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-blue-800 font-medium">
                     Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="rounded-xl border-2 border-blue-200 focus:border-sky-500 focus:ring focus:ring-sky-200 transition bg-white/70"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:scale-105 hover:shadow-2xl transition-transform"
            >
               Sign Up
            </Button>
          </form>
        </Form>

        <p className="mt-8 text-center text-sm text-blue-800">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-sky-600 font-semibold hover:underline"
          >
            Log in here 
          </a>
        </p>
      </div>
    </div>
    <Footer/>
    </>
  );
}

