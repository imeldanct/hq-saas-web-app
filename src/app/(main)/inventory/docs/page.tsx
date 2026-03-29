
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DocsPage() {
    return (
        <div className="px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold font-headline">Documentation</h1>
                    <p className="text-muted-foreground font-sans">
                        Find onboarding materials and important company updates here.
                    </p>
                </div>
                <Accordion type="single" collapsible className="w-full space-y-4">
                    <AccordionItem value="onboarding" className="border-b-0">
                        <Card className="transition-all duration-300 hover:shadow-xl">
                            <AccordionTrigger className="w-full text-left hover:no-underline p-6">
                                <div className="flex-1">
                                    <h3 className="font-headline text-xl">Onboarding</h3>
                                    <p className="text-muted-foreground text-sm font-normal pt-2 font-sans">Access the complete onboarding guide for new hires.</p>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="p-6 pt-0">
                                    <Button asChild>
                                        <Link href="/onboarding">
                                            <ArrowRight className="mr-2 h-4 w-4" />
                                            Go to Onboarding
                                        </Link>
                                    </Button>
                                </div>
                            </AccordionContent>
                        </Card>
                    </AccordionItem>
                    <AccordionItem value="updates" className="border-b-0">
                         <Card className="transition-all duration-300 hover:shadow-xl">
                            <AccordionTrigger className="w-full text-left hover:no-underline p-6">
                                <div className="flex-1">
                                    <h3 className="font-headline text-xl">Updates</h3>
                                    <p className="text-muted-foreground text-sm font-normal pt-2 font-sans">Check for recent changes and announcements.</p>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="p-6 pt-0 text-sm text-muted-foreground font-sans">
                                    There are no updates here.
                                </div>
                            </AccordionContent>
                        </Card>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    );
}
