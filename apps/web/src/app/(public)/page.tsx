import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GraduationCap, ArrowRight, BookOpen, BarChart3, LayoutDashboard } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-50 selection:bg-indigo-500/30">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 transition-colors hover:text-indigo-400">
            <GraduationCap className="h-6 w-6 text-indigo-500" />
            <span className="text-xl font-bold tracking-tight">GradeUnderflow</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">
              Sign In
            </Link>
            <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6">
              <Link href="/register">Get Started</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24 sm:py-32 lg:pb-40">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-600/20 rounded-full blur-3xl mix-blend-screen opacity-50 pointer-events-none" />
          
          <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
              Because your GPA <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-500">
                shouldn't crash.
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg md:text-xl text-zinc-400 mb-10 leading-relaxed">
              The ultimate academic intelligence platform for engineering students. 
              Manage your semesters, predict your final SGPA with precision, and uncover deep historical insights.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-8 h-14 text-lg">
                <Link href="/register">Start Tracking Free <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-8 h-14 text-lg border-zinc-800 hover:bg-zinc-900">
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-zinc-900/50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Everything you need to excel</h2>
              <p className="text-zinc-400 max-w-xl mx-auto">GradeUnderflow provides a comprehensive suite of tools designed specifically for the modern student workflow.</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {[
                {
                  icon: <BookOpen className="h-8 w-8 text-indigo-400 mb-4" />,
                  title: "Semester Management",
                  description: "Organize your academic journey term by term. Track subjects, credits, and faculty details effortlessly."
                },
                {
                  icon: <LayoutDashboard className="h-8 w-8 text-violet-400 mb-4" />,
                  title: "Evaluation Engine",
                  description: "Log every assignment, quiz, surprise test, and exam. We'll automatically calculate your internal and external marks."
                },
                {
                  icon: <BarChart3 className="h-8 w-8 text-fuchsia-400 mb-4" />,
                  title: "SGPA Prediction",
                  description: "Calculate your expected SGPA dynamically and find exactly what marks you need in the finals to achieve your targets."
                },
                {
                  icon: <GraduationCap className="h-8 w-8 text-emerald-400 mb-4" />,
                  title: "Deep Analytics",
                  description: "Visualize your academic health with performance trends, grade distributions, and targeted improvement analysis."
                }
              ].map((feature, i) => (
                <div key={i} className="bg-zinc-950/50 border border-zinc-800 p-8 rounded-3xl hover:border-indigo-500/50 transition-colors">
                  {feature.icon}
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-zinc-400 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-indigo-600/10" />
          <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
            <h2 className="text-4xl font-bold tracking-tight mb-6">Ready to stop guessing your grades?</h2>
            <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
              Join GradeUnderflow today and take absolute control of your academic trajectory.
            </p>
            <Button asChild size="lg" className="bg-white text-zinc-950 hover:bg-zinc-200 rounded-full px-10 h-14 text-lg font-semibold">
              <Link href="/register">Create Your Account</Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-12">
        <div className="container mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-indigo-500" />
            <span className="text-lg font-bold">GradeUnderflow</span>
          </div>
          <p className="text-zinc-500 text-sm">
            © {new Date().getFullYear()} GradeUnderflow. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
