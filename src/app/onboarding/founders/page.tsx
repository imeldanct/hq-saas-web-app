
'use client';

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { founders } from '@/lib/data';

export default function FoundersPage() {
    return (
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
             <div id="founders" className="scroll-mt-20 pb-20">
                <h2 className="text-3xl font-bold font-headline text-center mb-10">Meet the Founders</h2>
                <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    {founders.map((founder, index) => (
                        <div key={index} className="flex flex-col items-center">
                             <Dialog>
                                <DialogTrigger asChild>
                                    <Avatar className="h-32 w-32 mb-4 transition-transform duration-300 ease-in-out hover:scale-105 cursor-pointer">
                                        <AvatarImage src={founder.imageUrl} alt={founder.name} data-ai-hint={founder['data-ai-hint']} />
                                        <AvatarFallback>{founder.name.substring(0, 2)}</AvatarFallback>
                                    </Avatar>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                        <DialogTitle className="font-headline text-2xl">{founder.name}</DialogTitle>
                                    </DialogHeader>
                                    <Image
                                        src={founder.imageUrl}
                                        alt={founder.name}
                                        width={400}
                                        height={400}
                                        data-ai-hint={founder['data-ai-hint']}
                                        className="w-full rounded-lg object-cover"
                                    />
                                </DialogContent>
                            </Dialog>
                            <h3 className="text-xl font-semibold font-headline transition-transform duration-300 ease-in-out hover:scale-105">
                                {founder.profileUrl ? (
                                    <Link href={founder.profileUrl} target="_blank" rel="noopener noreferrer" className="transition-colors">
                                        {founder.name}
                                    </Link>
                                ) : (
                                    founder.name
                                )}
                            </h3>
                            <p className="text-primary">{founder.title}</p>
                            <p className="text-muted-foreground mt-2 text-sm font-sans">{founder.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-between items-center">
                <Link href="/onboarding" className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-110">
                    <span className="sr-only">Go to previous section</span>
                    <ArrowLeft className="h-6 w-6" />
                </Link>
                <Link href="/onboarding/departments" className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-110">
                    <span className="sr-only">Go to next section</span>
                    <ArrowRight className="h-6 w-6" />
                </Link>
            </div>
        </main>
    )
}

    