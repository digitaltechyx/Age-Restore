"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { SocialAuthButtons } from "./social-auth-buttons";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(1, { message: "Password is required." }),
});

export function LoginForm() {
  const router = useRouter();
  const { login, isAdmin, user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [pendingRedirect, setPendingRedirect] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");

  // Effect to handle redirect after login and auth state update
  useEffect(() => {
    if (pendingRedirect && user && loginEmail) {
      console.log('Login redirect check:', { loginEmail, isAdmin, user: user.email });
      
      // For admin users, redirect immediately based on email
      if (loginEmail === 'digitaltechyx@gmail.com') {
        console.log('Admin email detected, redirecting to admin dashboard immediately');
        router.push("/admin");
        setPendingRedirect(false);
        setIsLoading(false);
        return;
      }
      
      // For regular users, wait for auth state to update
      const timeoutId = setTimeout(() => {
        console.log('Redirecting regular user:', { loginEmail, isAdmin });
        router.push("/dashboard");
        setPendingRedirect(false);
        setIsLoading(false);
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [pendingRedirect, user, isAdmin, loginEmail, router]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await login(values.email, values.password);
      
      toast({
        title: "Login Successful",
        description: "Welcome back to AgeRestore!",
      });

      // Store the login email and set pending redirect
      setLoginEmail(values.email);
      setPendingRedirect(true);
      
      // For admin users, redirect immediately without waiting
      if (values.email === 'digitaltechyx@gmail.com') {
        console.log('Admin login detected, redirecting immediately');
        router.push("/admin");
        setIsLoading(false);
        return;
      }
      
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} />
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Log In"}
            </Button>
          </form>
        </Form>
        
        <SocialAuthButtons mode="login" />
        
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
