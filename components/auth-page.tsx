"use client";

import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { createClient } from "@/supabase/client";
import { AtSignIcon, ChevronLeftIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";

export function AuthPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState(false);

  const handleSocialLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsSocialLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/sign-in/confirm?next=/protected`,
        },
      });

      if (error) throw error;
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
      setIsSocialLoading(false);
    }
  };

  const signInWithEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    const email = (e.target as HTMLFormElement).email.value;
    if (!email) return;

    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/sign-in/confirm?next=/dashboard`,
        },
      });

      if (error) throw error;

      router.push("/sign-in/verify-request");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
      setIsLoading(false);
    }
  };

  return (
    <main className="relative md:h-screen md:overflow-hidden lg:grid lg:grid-cols-2">
      <div className="relative flex min-h-screen flex-col justify-center px-8">
        {/* Top Shades */}
        <div
          aria-hidden
          className="absolute inset-0 isolate -z-10 opacity-60 contain-strict"
        >
          <div className="absolute top-0 right-0 h-320 w-140 -translate-y-87.5 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,--theme(--color-foreground/.06)_0,hsla(0,0%,55%,.02)_50%,--theme(--color-foreground/.01)_80%)]" />
          <div className="absolute top-0 right-0 h-320 w-60 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)] [translate:5%_-50%]" />
          <div className="absolute top-0 right-0 h-320 w-60 -translate-y-87.5 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)]" />
        </div>
        <Button asChild className="absolute top-7 left-5" variant="ghost">
          <Link href="/">
            <ChevronLeftIcon data-icon="inline-start" />
            Home
          </Link>
        </Button>

        <div className="mx-auto space-y-4 sm:w-sm">
          <div className="flex flex-col space-y-1">
            <h1 className="font-bold text-2xl tracking-wide">
              Sign In or Join Now!
            </h1>
            <p className="text-base text-muted-foreground">
              login or create your supacreem account.
            </p>
          </div>
          <div className="space-y-2">
            <Button
              className="w-full"
              disabled={isSocialLoading}
              onClick={handleSocialLogin}
            >
              {isSocialLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <GoogleIcon data-icon="inline-start" />
                  Continue with Google
                </>
              )}
            </Button>
          </div>

          <AuthDivider>OR</AuthDivider>

          <form className="space-y-2" onSubmit={signInWithEmail}>
            <p className="text-start text-muted-foreground text-xs">
              Enter your email address to sign in or create an account
            </p>
            <InputGroup>
              <InputGroupInput
                name="email"
                placeholder="your.email@example.com"
                type="email"
                required
              />
              <InputGroupAddon align="inline-start">
                <AtSignIcon />
              </InputGroupAddon>
            </InputGroup>

            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Continue With Email"
              )}
            </Button>
          </form>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <p className="mt-8 text-muted-foreground text-sm">
            By clicking continue, you agree to our{" "}
            <a
              className="underline underline-offset-4 hover:text-primary"
              href="#"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              className="underline underline-offset-4 hover:text-primary"
              href="#"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>

      <div className="relative hidden h-full flex-col border-l bg-secondary p-10 lg:flex dark:bg-secondary/20">
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-background" />
        <div className="z-10 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-xl">
              &ldquo;This Platform has helped me to save time and serve my
              clients faster than ever before.&rdquo;
            </p>
            <footer className="font-mono font-semibold text-sm">
              ~ Completly Real
            </footer>
          </blockquote>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src="/hero-image.svg"
            alt="Auth background"
            width={1920}
            height={1080}
            className="size-2/3"
          />
        </div>
      </div>
    </main>
  );
}

function GoogleIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      width="200"
      height="200"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      {...props}
    >
      <g fill="none" fillRule="evenodd" clipRule="evenodd">
        <path
          fill="#F44336"
          d="M7.209 1.061c.725-.081 1.154-.081 1.933 0a6.57 6.57 0 0 1 3.65 1.82a100 100 0 0 0-1.986 1.93q-1.876-1.59-4.188-.734q-1.696.78-2.362 2.528a78 78 0 0 1-2.148-1.658a.26.26 0 0 0-.16-.027q1.683-3.245 5.26-3.86"
          opacity=".987"
        />
        <path
          fill="#FFC107"
          d="M1.946 4.92q.085-.013.161.027a78 78 0 0 0 2.148 1.658A7.6 7.6 0 0 0 4.04 7.99q.037.678.215 1.331L2 11.116Q.527 8.038 1.946 4.92"
          opacity=".997"
        />
        <path
          fill="#448AFF"
          d="M12.685 13.29a26 26 0 0 0-2.202-1.74q1.15-.812 1.396-2.228H8.122V6.713q3.25-.027 6.497.055q.616 3.345-1.423 6.032a7 7 0 0 1-.51.49"
          opacity=".999"
        />
        <path
          fill="#43A047"
          d="M4.255 9.322q1.23 3.057 4.51 2.854a3.94 3.94 0 0 0 1.718-.626q1.148.812 2.202 1.74a6.62 6.62 0 0 1-4.027 1.684a6.4 6.4 0 0 1-1.02 0Q3.82 14.524 2 11.116z"
          opacity=".993"
        />
      </g>
    </svg>
  );
}

function AuthDivider({ children, ...props }: React.ComponentProps<"div">) {
  return (
    <div className="relative flex w-full items-center" {...props}>
      <div className="w-full border-t" />
      <div className="flex w-max justify-center text-nowrap px-2 text-muted-foreground text-xs">
        {children}
      </div>
      <div className="w-full border-t" />
    </div>
  );
}
