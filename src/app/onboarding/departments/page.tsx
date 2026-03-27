
'use client';

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { departments } from '@/lib/data';

const sortedDepartments = [...departments].sort((a, b) => a.name.localeCompare(b.name));

export default function DepartmentsPage() {
    return (
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
             <div id="departments" className="scroll-mt-20 pb-20">
                <h2 className="text-3xl font-bold font-headline text-center mb-10">Our Departments</h2>
                <Accordion type="single" collapsible className="w-full space-y-4">
                    {sortedDepartments.map((dept, index) => (
                         <AccordionItem value={`item-${index}`} key={dept.name} className="border-b-0">
                            <Card className="transition-all duration-300 hover:shadow-xl">
                                <AccordionTrigger className="w-full text-left hover:no-underline p-6">
                                    <div className="flex-1">
                                        <CardTitle className="font-headline text-xl">{dept.name}</CardTitle>
                                        <p className="text-muted-foreground text-sm font-normal pt-2 font-sans">{dept.description}</p>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <CardContent className="pt-0">
                                        <div className="space-y-6">
                                            <div>
                                                <h4 className="text-lg font-semibold font-headline mb-4">Head of Department</h4>
                                                <div className="flex items-center gap-4">
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Avatar className="h-16 w-16 transition-transform duration-300 ease-in-out hover:scale-105 cursor-pointer">
                                                                <AvatarImage src={dept.hod.imageUrl || `https://picsum.photos/200/200?random=hod-${index}`} alt={dept.hod.name} data-ai-hint={dept.hod['data-ai-hint']} />
                                                                <AvatarFallback>{dept.hod.name.substring(0,2)}</AvatarFallback>
                                                            </Avatar>
                                                        </DialogTrigger>
                                                        <DialogContent className="sm:max-w-md">
                                                            <DialogHeader>
                                                                <DialogTitle className="font-headline text-2xl">{dept.hod.name}</DialogTitle>
                                                            </DialogHeader>
                                                            <Image
                                                              src={dept.hod.imageUrl || `https://picsum.photos/400/400?random=hod-${index}`}
                                                              alt={dept.hod.name}
                                                              width={400}
                                                              height={400}
                                                              data-ai-hint={dept.hod['data-ai-hint']}
                                                              className="w-full rounded-lg object-cover"
                                                            />
                                                        </DialogContent>
                                                    </Dialog>
                                                    <div>
                                                         <h3 className="text-lg font-semibold font-headline transition-transform duration-300 ease-in-out hover:scale-105">
                                                            <Link href={dept.hod.profileUrl || '#'} target="_blank" rel="noopener noreferrer" className="transition-colors">
                                                                {dept.hod.name}
                                                            </Link>
                                                        </h3>
                                                        <p className="text-sm text-muted-foreground font-sans">{dept.hod.title}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            {dept.staff && dept.staff.length > 0 && (
                                                <div>
                                                    <h4 className="text-lg font-semibold font-headline mb-4">Team Members</h4>
                                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                                        {/* Staff mapping would go here */}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </AccordionContent>
                            </Card>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>

            <div className="flex justify-between items-center">
                 <Link href="/onboarding/founders" className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-110">
                    <span className="sr-only">Go to previous section</span>
                    <ArrowLeft className="h-6 w-6" />
                </Link>
                <Link href="/onboarding/handbook" className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-110">
                    <span className="sr-only">Go to Handbook</span>
                    <ArrowRight className="h-6 w-6" />
                </Link>
            </div>
        </main>
    )
}
