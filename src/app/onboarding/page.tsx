
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function OnboardingWelcomePage() {
  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
      <div id="welcome" className="mb-16 scroll-mt-20 text-left">
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">Welcome to Osoft, Anon!</h1>
        <p className="text-lg text-muted-foreground mb-4 max-w-3xl font-sans">We're excited to have you join our team and look forward to your contributions.</p>
        <p className="text-lg text-muted-foreground mb-8 max-w-3xl font-sans">Osoft is an information technology company providing MIS and other software solutions to governmental and private sector management issues.</p>
      </div>

      <div className="mb-12">
        <Image
          src="https://osoftint.com/wp-content/uploads/2025/04/IMG_7784-scaled.jpg"
          alt="Osoft Office Reception Area"
          width={1200}
          height={800}
          data-ai-hint="office reception"
          className="w-full rounded-lg object-cover shadow-lg"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12 text-left">
          <div>
            <h3 className="text-xl font-semibold font-headline mb-2">Our Vision</h3>
            <p className="text-muted-foreground font-sans">We are a team of excellent minded people setting standard in enterprise development.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold font-headline mb-2">Our Mission</h3>
            <p className="text-muted-foreground font-sans">We are an e-quality software firm with the drive to reinvent the work place culture, delivering cutting edge tools.</p>
          </div>
      </div>
      
      <div className="mt-16 flex justify-between items-center">
          <Button asChild>
              <Link href="https://osoftint.com/" target="_blank">
                  <ArrowRight className="h-4 w-4" />
                  Go to Website
              </Link>
          </Button>
          
          <Link href="/onboarding/founders" className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-110">
              <span className="sr-only">Go to next section</span>
              <ArrowRight className="h-6 w-6" />
          </Link>
      </div>

    </main>
  );
}
