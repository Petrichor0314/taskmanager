import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  FolderKanban,
  CheckCircle2,
  LayoutDashboard,
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
  Clock,
  Target,
  BarChart3,
} from 'lucide-react'

export default function LandingPage() {
  const features = [
    {
      icon: <LayoutDashboard className="h-6 w-6" />,
      title: 'Intuitive Dashboard',
      description: 'Get a bird\'s eye view of all your projects and tasks in one place.',
    },
    {
      icon: <CheckCircle2 className="h-6 w-6" />,
      title: 'Task Management',
      description: 'Create, organize, and track tasks with ease. Set due dates and priorities.',
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: 'Progress Tracking',
      description: 'Visual progress bars and statistics to keep you motivated.',
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: 'Project Organization',
      description: 'Group related tasks into projects for better organization.',
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: 'Due Date Reminders',
      description: 'Never miss a deadline with clear due date indicators.',
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Secure & Private',
      description: 'Your data is protected with industry-standard security.',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <FolderKanban className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Task Manager</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container py-24 md:py-32">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <Badge variant="secondary" className="mb-4 px-4 py-1.5">
            <Sparkles className="mr-2 h-3.5 w-3.5" />
            Simple. Powerful. Free.
          </Badge>
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Manage Your Tasks{' '}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Effortlessly
            </span>
          </h1>
          <p className="mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Stay organized, boost productivity, and achieve your goals with our intuitive 
            task management platform. Perfect for individuals and teams.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link to="/register">
              <Button size="lg" className="gap-2 text-base">
                Start For Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="text-base">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-24">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <Badge variant="outline" className="mb-4">
            <Zap className="mr-2 h-3.5 w-3.5" />
            Features
          </Badge>
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
            Everything you need to stay productive
          </h2>
          <p className="text-lg text-muted-foreground">
            Powerful features designed to help you manage tasks and projects with ease.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="group relative overflow-hidden border-muted/50 transition-all hover:border-primary/50 hover:shadow-lg">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-muted/30 py-16">
        <div className="container">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { value: '10K+', label: 'Active Users' },
              { value: '50K+', label: 'Projects Created' },
              { value: '500K+', label: 'Tasks Completed' },
              { value: '99.9%', label: 'Uptime' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold tracking-tight text-primary">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-24">
        <Card className="border-0 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10">
          <CardContent className="flex flex-col items-center py-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
              Ready to get started?
            </h2>
            <p className="mb-8 max-w-lg text-lg text-muted-foreground">
              Join thousands of users who are already managing their tasks more effectively.
              It's free to get started!
            </p>
            <Link to="/register">
              <Button size="lg" className="gap-2 text-base">
                Create Free Account
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <FolderKanban className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">Task Manager</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Task Manager. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
