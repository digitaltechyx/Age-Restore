import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { Logo } from '@/components/logo';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center bg-background shadow-sm">
        <Logo />
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Button variant="ghost" asChild>
            <Link href="/login" prefetch={false}>
              Login
            </Link>
          </Button>
          <Button asChild>
            <Link href="/signup" prefetch={false}>
              Sign Up
            </Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-8 sm:py-12 md:py-24 lg:py-32 xl:py-48 bg-background">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tighter font-headline">
                    Transform Your Life in 30 Days with AgeRestore
                  </h1>
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-[600px]">
                    Our quality assurance program guarantees visible results within 30 days. Document your journey, track your progress, and see real transformation through our proven system.
                  </p>
                </div>
                       <div className="flex flex-col gap-2 min-[400px]:flex-row">
                         <Button size="lg" asChild>
                           <Link
                             href="/signup"
                             className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                             prefetch={false}
                           >
                             Get Started
                             <ArrowRight className="ml-2 h-4 w-4" />
                           </Link>
                         </Button>
                       </div>
              </div>
              <div className="relative w-full h-full lg:order-last">
                <Image
                  src="/hero-image.png"
                  width={800}
                  height={600}
                  alt="Your custom hero image for Age Restore"
                  quality={95}
                  priority
                  className="w-full h-full object-cover rounded-xl shadow-2xl drop-shadow-2xl"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2025 AgeRestore. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="/terms" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Terms of Service
          </Link>
          <Link href="/privacy" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}

