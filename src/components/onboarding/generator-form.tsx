
'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { generateOnboardingContent } from '@/app/(main)/inventory/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Sparkles } from 'lucide-react';

const initialState = {
  content: '',
  error: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? 'Generating Your Guide...' : 'Generate My Personal Guide'}
    </Button>
  );
}

export function GeneratorForm() {
  const [state, formAction] = useActionState(generateOnboardingContent, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.error) {
      toast({
        title: "Error",
        description: state.error,
        variant: "destructive",
      });
    }
  }, [state, toast]);

  return (
    <>
      <form action={formAction} className="space-y-4 font-sans text-center">
        <SubmitButton />
      </form>
      
      {state?.content && (
        <Card className="mt-6 border-primary/50 text-left">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <h3 className="font-headline text-lg font-semibold">Your Personalized Onboarding Guide</h3>
                </div>
            </CardHeader>
            <CardContent>
                <div 
                  className="prose prose-invert prose-sm max-w-none font-sans"
                  dangerouslySetInnerHTML={{ __html: state.content.replace(/\n/g, '<br />') }}
                />
            </CardContent>
        </Card>
      )}
    </>
  );
}
