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
import {Link} from "react-router-dom";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import { User, Mail, Lock, UserPlus } from "lucide-react";

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
    <>
    <Header/>
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-6 pt-32">
      <div className="w-full max-w-md">
        {/* Main signup card */}
        <div className="rounded-3xl bg-white/95 backdrop-blur-sm shadow-2xl p-8 ring-1 ring-blue-200/50 border border-blue-100">
          {/* Header section with icon */}
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
              <UserPlus className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent">
              Welcome to JalSthar
            </h2>
            <p className="text-slate-600 mt-2 font-medium">
              Join the groundwater monitoring network
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-semibold">Full Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="John Doe" 
                        className="bg-white/90 border-blue-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400 shadow-sm rounded-xl py-3 ring-1 ring-blue-100/50 h-12" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-semibold">Email Address</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="you@example.com" 
                        className="bg-white/90 border-blue-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400 shadow-sm rounded-xl py-3 ring-1 ring-blue-100/50 h-12" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-semibold">Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        className="bg-white/90 border-blue-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400 shadow-sm rounded-xl py-3 ring-1 ring-blue-100/50 h-12"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg font-semibold py-3 rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-[1.02] text-lg"
              >
                <UserPlus className="h-5 w-5 mr-2" />
                Create Account
              </Button>
            </form>
          </Form>

          {/* Login link */}
          <div className="mt-6 text-center">
            <p className="text-slate-600">
              Already have an account?
            </p>
            <Link 
              to="/login" 
              className="inline-flex items-center gap-2 mt-2 text-blue-600 hover:text-cyan-600 font-semibold hover:underline transition-all duration-200 text-lg"
            >
              Sign In Instead
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>

        {/* Additional info card */}
        <div className="mt-6 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 p-6 shadow-lg ring-1 ring-blue-200/50 border border-blue-100">
          <div className="text-center">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Why Join JalSthar?</h3>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="text-center">
                <div className="text-2xl mb-1">📊</div>
                <p className="text-slate-600 font-medium">Real-time Data</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1">🚨</div>
                <p className="text-slate-600 font-medium">Smart Alerts</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1">🌍</div>
                <p className="text-slate-600 font-medium">Impact Research</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
}