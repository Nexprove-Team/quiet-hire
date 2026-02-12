"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import Link from "next/link";
import {
  UserSearch,
  Buildings2,
  ArrowLeft,
  Eye,
  EyeSlash,
  Sms,
  Lock,
  User,
  Briefcase,
  Hashtag,
  Profile,
} from "@hackhyre/ui/icons";
import { Loader2 } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { Button } from "@hackhyre/ui/components/button";
import { Input } from "@hackhyre/ui/components/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@hackhyre/ui/components/form";
import { Separator } from "@hackhyre/ui/components/separator";
import { cn } from "@hackhyre/ui/lib/utils";

type Role = "candidate" | "recruiter";

const baseSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.email("Please enter a valid email"),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username must be less than 30 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Only letters, numbers, and underscores allowed"
      ),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const recruiterSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.email("Please enter a valid email"),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username must be less than 30 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Only letters, numbers, and underscores allowed"
      ),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    companyName: z.string().min(1, "Company name is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type BaseValues = z.infer<typeof baseSchema>;
type RecruiterValues = z.infer<typeof recruiterSchema>;
type FormValues = BaseValues | RecruiterValues;

export function SignUpForm() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isRecruiter = selectedRole === "recruiter";

  const form = useForm<FormValues>({
    resolver: zodResolver(isRecruiter ? recruiterSchema : baseSchema),
    defaultValues: {
      name: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      ...(isRecruiter ? { companyName: "" } : {}),
    },
  });

  function handleRoleSelect(role: Role) {
    setSelectedRole(role);
    form.reset();
  }

  async function onSubmit(values: FormValues) {
    if (!selectedRole) return;
    setIsLoading(true);

    const { error } = await authClient.signUp.email({
      email: values.email,
      password: values.password,
      name: values.name,
      username: values.username,
      role: selectedRole,
      companyName:
        isRecruiter && "companyName" in values
          ? values.companyName
          : undefined,
    });

    setIsLoading(false);

    if (error) {
      toast.error(error.message ?? "Something went wrong");
      return;
    }

    toast.success("Account created! Check your email for a verification code.");
    router.push(`/verify-email?email=${encodeURIComponent(values.email)}&role=${selectedRole}`);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <AnimatePresence mode="wait">
        {!selectedRole ? (
          /* ── Role Selection ─────────────────────────────────────── */
          <motion.div
            key="role-select"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Mobile logo */}
            <div className="lg:hidden">
              <span className="font-mono text-xl font-bold">
                Hack<span className="text-primary">Hyre</span>
              </span>
            </div>

            <div className="space-y-2">
              <h1 className="font-mono text-3xl font-bold tracking-tight">
                Join HackHyre
              </h1>
              <p className="text-muted-foreground text-sm">
                Choose how you want to get started
              </p>
            </div>

            <div className="space-y-3">
              {/* Talent card */}
              <button
                type="button"
                onClick={() => handleRoleSelect("candidate")}
                className={cn(
                  "border-border bg-card flex w-full items-center gap-4 rounded-xl border p-5 text-left transition-all duration-200",
                  "hover:border-primary/40 hover:shadow-[0_0_24px_oklch(0.82_0.22_155/0.1)]"
                )}
              >
                <div className="bg-primary/10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl">
                  <UserSearch
                    size={24}
                    variant="Bulk"
                    className="text-primary"
                  />
                </div>
                <div className="min-w-0">
                  <p className="font-mono text-sm font-semibold">
                    I&apos;m looking for work
                  </p>
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    Find jobs, showcase your skills, connect with teams
                  </p>
                </div>
                <ArrowLeft
                  size={18}
                  variant="Linear"
                  className="text-muted-foreground ml-auto shrink-0 rotate-180"
                />
              </button>

              {/* Recruiter card */}
              <button
                type="button"
                onClick={() => handleRoleSelect("recruiter")}
                className={cn(
                  "border-border bg-card flex w-full items-center gap-4 rounded-xl border p-5 text-left transition-all duration-200",
                  "hover:border-primary/40 hover:shadow-[0_0_24px_oklch(0.82_0.22_155/0.1)]"
                )}
              >
                <div className="bg-primary/10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl">
                  <Buildings2
                    size={24}
                    variant="Bulk"
                    className="text-primary"
                  />
                </div>
                <div className="min-w-0">
                  <p className="font-mono text-sm font-semibold">
                    I&apos;m hiring talent
                  </p>
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    Post jobs, discover candidates, build your team
                  </p>
                </div>
                <ArrowLeft
                  size={18}
                  variant="Linear"
                  className="text-muted-foreground ml-auto shrink-0 rotate-180"
                />
              </button>
            </div>

            <p className="text-muted-foreground text-center text-sm">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="text-primary hover:text-primary/80 font-medium underline-offset-4 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </motion.div>
        ) : (
          /* ── Registration Form ──────────────────────────────────── */
          <motion.div
            key="register-form"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Back + role indicator */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSelectedRole(null)}
                className="text-muted-foreground hover:text-foreground flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-white/5"
              >
                <ArrowLeft size={18} variant="Linear" />
              </button>
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 flex h-6 w-6 items-center justify-center rounded-md">
                  {selectedRole === "candidate" ? (
                    <Profile size={14} variant="Bulk" className="text-primary" />
                  ) : (
                    <Briefcase size={14} variant="Bulk" className="text-primary" />
                  )}
                </div>
                <span className="text-muted-foreground text-xs font-medium">
                  {selectedRole === "candidate" ? "Talent" : "Job Creator"}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="font-mono text-2xl font-bold tracking-tight">
                Create your account
              </h1>
              <p className="text-muted-foreground text-sm">
                Fill in your details to get started
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-3.5"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User
                            size={18}
                            variant="Bulk"
                            className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2"
                          />
                          <Input
                            placeholder="Jane Doe"
                            autoComplete="name"
                            disabled={isLoading}
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Sms
                            size={18}
                            variant="Bulk"
                            className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2"
                          />
                          <Input
                            type="email"
                            placeholder="you@example.com"
                            autoComplete="email"
                            disabled={isLoading}
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Hashtag
                            size={18}
                            variant="Bulk"
                            className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2"
                          />
                          <Input
                            placeholder="janedoe"
                            autoComplete="username"
                            disabled={isLoading}
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {isRecruiter && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.2 }}
                  >
                    <FormField
                      control={form.control}
                      name={"companyName" as keyof FormValues}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Buildings2
                                size={18}
                                variant="Bulk"
                                className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2"
                              />
                              <Input
                                placeholder="Acme Inc."
                                disabled={isLoading}
                                className="pl-10"
                                {...field}
                                value={field.value ?? ""}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock
                              size={18}
                              variant="Bulk"
                              className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2"
                            />
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              autoComplete="new-password"
                              disabled={isLoading}
                              className="pl-10 pr-9"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2.5 -translate-y-1/2 transition-colors"
                              tabIndex={-1}
                            >
                              {showPassword ? (
                                <EyeSlash size={16} variant="Linear" />
                              ) : (
                                <Eye size={16} variant="Linear" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock
                              size={18}
                              variant="Bulk"
                              className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2"
                            />
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              autoComplete="new-password"
                              disabled={isLoading}
                              className="pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  className="!mt-5 w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create account"
                  )}
                </Button>
              </form>
            </Form>

            <div className="relative">
              <Separator />
              <span className="text-muted-foreground bg-background absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 text-xs">
                or
              </span>
            </div>

            <p className="text-muted-foreground text-center text-sm">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="text-primary hover:text-primary/80 font-medium underline-offset-4 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
