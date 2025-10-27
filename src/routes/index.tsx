import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "../ui/logo";
import { cn } from "@/utils/misc";
import { buttonVariants } from "@/ui/button-util";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/card";
import { motion } from "framer-motion";
import {
  Heart,
  Home,
  Wrench,
  GraduationCap,
  Laptop,
  CheckCircle2,
  CreditCard,
  Star,
  Zap,
  Headphones,
  Users,
  TrendingUp,
  Clock,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

function Index() {
  // Mock categories data (replace with real Convex query when data is seeded)
  const categories = [
    {
      name: "Therapy & Wellness",
      description: "Mental health support and wellness services",
      icon: "heart",
      providerCount: 120,
    },
    {
      name: "Home Cleaning",
      description: "Professional cleaning services for your home",
      icon: "home",
      providerCount: 200,
    },
    {
      name: "Handyman & Repairs",
      description: "Fix anything in your home or office",
      icon: "wrench",
      providerCount: 150,
    },
    {
      name: "Tutoring",
      description: "Expert tutors for all subjects and levels",
      icon: "graduation-cap",
      providerCount: 180,
    },
    {
      name: "Tech Support",
      description: "IT help and technical assistance",
      icon: "laptop",
      providerCount: 90,
    },
  ];

  const features = [
    {
      icon: <CheckCircle2 className="w-8 h-8 text-primary" />,
      title: "Verified Providers",
      description: "All service providers are background-checked and verified",
    },
    {
      icon: <CreditCard className="w-8 h-8 text-secondary" />,
      title: "Secure Payments",
      description: "Pay safely with our encrypted payment system",
    },
    {
      icon: <Star className="w-8 h-8 text-primary" />,
      title: "Ratings & Reviews",
      description: "Real reviews from real customers",
    },
    {
      icon: <Zap className="w-8 h-8 text-secondary" />,
      title: "Real-time Updates",
      description: "Track your service request in real-time with Convex",
    },
    {
      icon: <Headphones className="w-8 h-8 text-primary" />,
      title: "24/7 Support",
      description: "We're here to help whenever you need us",
    },
  ];

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, JSX.Element> = {
      heart: <Heart className="w-10 h-10" />,
      home: <Home className="w-10 h-10" />,
      wrench: <Wrench className="w-10 h-10" />,
      "graduation-cap": <GraduationCap className="w-10 h-10" />,
      laptop: <Laptop className="w-10 h-10" />,
    };
    return icons[iconName] || <Heart className="w-10 h-10" />;
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <Logo />
            <span className="text-xl font-bold text-foreground">JomTolong</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "hidden sm:flex"
              )}
            >
              Sign In
            </Link>
            <Link
              to="/login"
              className={buttonVariants({ size: "sm" })}
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-background to-muted/20 py-20 sm:py-32">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25" />
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="mx-auto max-w-4xl text-center"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="mb-8">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                <Clock className="mr-2 h-4 w-4" />
                Launching Soon in Malaysia
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl"
            >
              Need help?{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Let's JomTolong
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl"
            >
              Book trusted help for therapy, cleaning, fixing, tutoring, and more — all in one place
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Link
                to="/login"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-12 px-8 text-base shadow-lg hover:shadow-xl transition-shadow"
                )}
              >
                Find Help
              </Link>
              <Link
                to="/login"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-12 px-8 text-base border-secondary text-secondary hover:bg-secondary/10"
                )}
              >
                Offer Help
              </Link>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="mt-16 grid grid-cols-3 gap-8 rounded-2xl border bg-card/50 p-8 backdrop-blur"
            >
              <div className="flex flex-col items-center">
                <Users className="mb-2 h-8 w-8 text-primary" />
                <div className="text-3xl font-bold text-foreground">500+</div>
                <div className="text-sm text-muted-foreground">Helpers</div>
              </div>
              <div className="flex flex-col items-center">
                <TrendingUp className="mb-2 h-8 w-8 text-secondary" />
                <div className="text-3xl font-bold text-foreground">2.5k+</div>
                <div className="text-sm text-muted-foreground">Bookings</div>
              </div>
              <div className="flex flex-col items-center">
                <Star className="mb-2 h-8 w-8 text-primary" />
                <div className="text-3xl font-bold text-foreground">4.9</div>
                <div className="text-sm text-muted-foreground">Avg Rating</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="border-b bg-background py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
              How It Works
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Getting help is easier than ever with JomTolong
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Browse Services",
                description: "Explore our wide range of trusted service providers",
              },
              {
                step: "2",
                title: "Book & Pay Securely",
                description: "Choose your provider and pay safely through our platform",
              },
              {
                step: "3",
                title: "Get It Done",
                description: "Sit back and let our verified helpers take care of it",
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="relative h-full border-2 transition-all hover:border-primary hover:shadow-lg">
                  <CardHeader>
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/60 text-3xl font-bold text-primary-foreground shadow-lg">
                      {item.step}
                    </div>
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {item.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Categories Section */}
      <section className="border-b bg-muted/20 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
              Top Categories
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Find the perfect helper for your needs
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="group h-full cursor-pointer transition-all hover:scale-105 hover:shadow-xl">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 text-primary transition-all group-hover:from-primary group-hover:to-secondary group-hover:text-primary-foreground">
                      {getIconComponent(category.icon)}
                    </div>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="mb-2">
                      {category.description}
                    </CardDescription>
                    <p className="text-sm font-medium text-primary">
                      {category.providerCount}+ providers
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="border-b bg-background py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
              Why Choose JomTolong?
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              We're committed to providing the best service marketplace experience
            </p>
          </motion.div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full border-2 transition-all hover:border-primary/50 hover:shadow-lg">
                  <CardHeader>
                    <div className="mb-4">{feature.icon}</div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Join as Provider Section */}
      <section className="border-b bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-4xl"
          >
            <Card className="overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-card to-card/50 shadow-2xl backdrop-blur">
              <CardHeader className="space-y-4 text-center sm:space-y-6 sm:p-12">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary">
                  <Users className="h-10 w-10 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle className="mb-4 text-3xl sm:text-4xl">
                    Got skills? Start earning with JomTolong
                  </CardTitle>
                  <CardDescription className="text-base sm:text-lg">
                    Create your profile, list your services, and start helping others today
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex justify-center pb-12">
                <Link
                  to="/login"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "h-12 px-8 text-base shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                  )}
                >
                  Become a Helper
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <div className="mb-4 flex items-center gap-2">
                <Logo />
                <span className="text-xl font-bold text-foreground">JomTolong</span>
              </div>
              <p className="mb-4 text-sm text-muted-foreground">
                Malaysia's trusted service marketplace. Connecting helpers with those who need help.
              </p>
              <p className="text-xs text-muted-foreground">
                © 2025 JomCloud Network. All rights reserved.
              </p>
            </div>

            <div>
              <h3 className="mb-4 font-semibold text-foreground">About</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Our Story</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">How It Works</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-semibold text-foreground">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Safety</a></li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-semibold text-foreground">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Built with ❤️ using TanStack, React, and Convex
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
