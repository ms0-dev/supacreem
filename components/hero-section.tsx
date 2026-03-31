import { ArrowRight, ArrowUpRight, GithubIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <Badge variant="outline">
              🚀 Launch Faster
              <ArrowUpRight className="ml-2 size-4" />
            </Badge>
            <h1 className="my-6 text-4xl font-bold text-pretty lg:text-5xl">
              Next.js + Supabase Boilerplate with CREEM
            </h1>
            <p className="text-muted-foreground mb-8 text-balance lg:text-lg">
              Production-ready Next.js starter template with Supabase and Creem
            </p>
            <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
              <Button className="w-full sm:w-auto" asChild>
                <Link href="/github">
                  Get Started
                  <GithubIcon />
                </Link>
              </Button>
              <Button variant="outline" className="w-full sm:w-auto" asChild>
                <Link href="/dashboard">
                  Demo
                  <ArrowRight />
                </Link>
              </Button>
            </div>
          </div>
          <Image
            src="/hero-image.svg"
            alt="Supabase and Creem being friends"
            width={400}
            height={400}
            className="max-h-96 w-full rounded-md object-contain"
          />
        </div>
      </div>
    </section>
  );
}
