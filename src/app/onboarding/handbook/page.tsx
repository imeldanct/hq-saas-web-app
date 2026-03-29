
// import Link from "next/link";
// import { ArrowRight } from "lucide-react";
// import {
//     Card,
//     CardContent,
//     CardDescription,
//     CardHeader,
//     CardTitle,
//   } from "@/components/ui/card";

// export default function HandbookPage() {
//     return (
//         <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
//              <div id="handbook" className="scroll-mt-20 pb-20">
//                 <div className="space-y-4 text-center mb-12">
//                     <h1 className="text-4xl md:text-5xl font-bold font-headline">Company Handbook</h1>
//                     <p className="text-lg text-muted-foreground max-w-3xl mx-auto font-sans">
//                         Your official guide to our company policies, procedures, and culture.
//                     </p>
//                 </div>
                
//                 <div className="max-w-4xl mx-auto space-y-8">
//                     <Card>
//                         <CardHeader>
//                             <CardTitle className="font-headline text-2xl">Work Hours & Remote Policy</CardTitle>
//                         </CardHeader>
//                         <CardContent className="font-sans text-muted-foreground space-y-4">
//                             <p>Our standard working hours are from 9:00 AM to 5:00 PM, Monday through Friday. We operate on a hybrid model, with employees expected to be in the office at least three days a week. Please coordinate with your department head for your specific in-office schedule.</p>
//                             <p>We support flexible working arrangements, but core collaboration hours are between 10:00 AM and 4:00 PM.</p>
//                         </CardContent>
//                     </Card>
//                      <Card>
//                         <CardHeader>
//                             <CardTitle className="font-headline text-2xl">Vacation & Leave</CardTitle>
//                         </CardHeader>
//                         <CardContent className="font-sans text-muted-foreground space-y-4">
//                             <p>All full-time employees are entitled to 20 paid vacation days per year, in addition to public holidays. Please submit your leave requests through the employee portal at least two weeks in advance for planning purposes.</p>
//                              <p>For sick leave, please notify your manager as early as possible on the day of your absence.</p>
//                         </CardContent>
//                     </Card>
//                      <Card>
//                         <CardHeader>
//                             <CardTitle className="font-headline text-2xl">Code of Conduct</CardTitle>
//                         </CardHeader>
//                         <CardContent className="font-sans text-muted-foreground space-y-4">
//                             <p>We are committed to maintaining a respectful, inclusive, and professional work environment. Harassment and discrimination of any kind are not tolerated. We expect all employees to treat their colleagues with dignity and respect.</p>
//                             <p>Full details of our code of conduct can be found on the internal company drive.</p>
//                         </CardContent>
//                     </Card>
//                 </div>
//             </div>

//             <div className="flex justify-end items-center">
//                 <Link href="/onboarding" className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-110">
//                     <span className="sr-only">Go to Welcome</span>
//                     <ArrowRight className="h-6 w-6" />
//                 </Link>
//             </div>
//         </main>
//     )
// }



'use client';

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";

export default function HandbookPage() {
    return (
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
             <div id="handbook" className="scroll-mt-20 pb-20">
                <div className="space-y-4 text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold font-headline">Company Handbook</h1>
                    <p className="text-lg text-muted-foreground max-w-3xl mx-auto font-sans">
                        Your official guide to our company policies, procedures, and culture.
                    </p>
                </div>
                
                <div className="max-w-4xl mx-auto space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl">Work Hours & Remote Policy</CardTitle>
                        </CardHeader>
                        <CardContent className="font-sans text-muted-foreground space-y-4">
                            <p>Our standard working hours are from 9:00 AM to 5:00 PM, Monday through Friday. We operate on a hybrid model, with employees expected to be in the office at least three days a week. Please coordinate with your department head for your specific in-office schedule.</p>
                            <p>We support flexible working arrangements, but core collaboration hours are between 10:00 AM and 4:00 PM.</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl">Vacation & Leave</CardTitle>
                        </CardHeader>
                        <CardContent className="font-sans text-muted-foreground space-y-4">
                            <p>All full-time employees are entitled to 20 paid vacation days per year, in addition to public holidays. Please submit your leave requests through the employee portal at least two weeks in advance for planning purposes.</p>
                             <p>For sick leave, please notify your manager as early as possible on the day of your absence.</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl">Code of Conduct</CardTitle>
                        </CardHeader>
                        <CardContent className="font-sans text-muted-foreground space-y-4">
                            <p>We are committed to maintaining a respectful, inclusive, and professional work environment. Harassment and discrimination of any kind are not tolerated. We expect all employees to treat their colleagues with dignity and respect.</p>
                            <p>Full details of our code of conduct can be found on the internal company drive.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="flex justify-between items-center">
                 <Link href="/onboarding/departments" className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-110">
                    <span className="sr-only">Go to previous section</span>
                    <ArrowLeft className="h-6 w-6" />
                </Link>
                <Link href="/onboarding" className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-110">
                    <span className="sr-only">Go to Welcome</span>
                    <ArrowRight className="h-6 w-6" />
                </Link>
            </div>
        </main>
    )
}

