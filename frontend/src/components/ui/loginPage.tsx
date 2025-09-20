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

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginPage() {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof loginSchema>) {
    console.log("Login values:", values);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-sky-100 via-blue-50 to-sky-200 p-6">
      <div className="w-full max-w-xl rounded-3xl bg-white/90 p-12 shadow-2xl border border-blue-200">
        {/* Title */}
        <h2 className="mb-3 text-center text-4xl font-bold text-sky-800 drop-shadow-sm">
          Welcome Back 🌊
        </h2>
        <p className="mb-10 text-center text-lg text-sky-700">
          Please sign in to your account
        </p>
        {/* Add your form here */}
      </div>
    </div>
  );}
