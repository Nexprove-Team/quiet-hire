import type { Metadata } from "next";
import { SignUpForm } from "@/components/auth/sign-up-form";

export const metadata: Metadata = {
  title: "Sign Up — HackHyre",
  description: "Create your HackHyre account",
};

export default function SignUpPage() {
  return <SignUpForm />;
}
