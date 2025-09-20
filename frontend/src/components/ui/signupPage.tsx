
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

const signupSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-500 via-pink-400 to-yellow-300 p-6 relative overflow-hidden">
      {/* Animated floating blobs using Tailwind only */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-bounce" />
      <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse" />

      {/* Signup card */}
      <div className="w-full max-w-md rounded-3xl bg-white/30 backdrop-blur-lg shadow-2xl p-8 border border-white/40 animate-fadeIn">
        <h2 className="mb-2 text-center text-3xl font-bold text-slate-900">
          🚀 Join the Adventure!
        </h2>
        <p className="mb-6 text-center text-sm text-slate-600">
          Let’s create your account and get started 🎉
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>🌟 Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      className="rounded-xl border-2 focus:border-pink-500 transition"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>📧 Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="you@example.com"
                      className="rounded-xl border-2 focus:border-yellow-500 transition"
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
                  <FormLabel>🔒 Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="rounded-xl border-2 focus:border-purple-500 transition"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 text-white font-semibold py-2 px-4 rounded-xl shadow-lg hover:scale-105 transition-transform"
            >
              ✨ Sign Up
            </Button>
          </form>
        </Form>

        <p className="mt-6 text-center text-sm text-slate-700">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-purple-600 font-semibold hover:underline"
          >
            Log in here 💫
          </a>
        </p>
      </div>
    </div>
  );
}
