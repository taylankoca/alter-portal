import { ApplicationForm } from '@/components/application-form';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12">
      <div className="w-full max-w-4xl space-y-8 py-12">
        <header className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl font-headline">
            Join Alter Careers
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Your next career move is just a few clicks away. Fill out the form below or upload your resume to get started.
          </p>
        </header>
        <ApplicationForm />
      </div>
    </main>
  );
}
