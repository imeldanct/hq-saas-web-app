import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md">
      <div className={cn("flex items-center gap-2 font-headline", className)}>
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-primary"
          aria-hidden="true"
        >
          <path
            d="M4 4H14V14H4V4Z"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M18 4H28V14H18V4Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M4 18H14V28H4V18Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M18 18H28V28H18V18Z"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-2xl font-bold text-foreground">HQ</span>
      </div>
    </Link>
  );
}
