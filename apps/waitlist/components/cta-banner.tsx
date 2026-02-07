"use client";

import { Button } from "@quiethire/ui/components/button";
import { motion } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";

export function CTABanner() {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[2.5rem] bg-foreground px-8 py-20 text-center text-background md:px-16 md:py-24 shadow-2xl"
        >
          {/* Decorative gradient orbs - animated */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -left-[20%] top-[-20%] h-[500px] w-[500px] animate-pulse-slow rounded-full bg-primary/20 blur-[120px]" />
            <div className="absolute -bottom-[20%] -right-[20%] h-[500px] w-[500px] animate-pulse-slow rounded-full bg-blue-500/20 blur-[120px] delay-700" />
            <div className="absolute left-[20%] top-[40%] h-[200px] w-[200px] animate-float rounded-full bg-white/5 blur-[50px]" />
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="mb-6 inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/80 backdrop-blur-sm">
              <Sparkles className="mr-2 size-3.5" />
              <span>Limited Early Access</span>
            </div>

            <h2 className="mx-auto max-w-2xl text-4xl font-medium tracking-tight md:text-5xl lg:text-6xl">
              Ready to transform <br className="hidden md:block" />
              <span className="font-display italic text-primary-foreground">
                your hiring process?
              </span>
            </h2>

            <p className="mx-auto mt-6 max-w-xl text-lg text-white/60 md:text-xl">
              Join hundreds of forward-thinking companies already on the
              waitlist. Be the first to experience recruitment done right.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className="group h-14 gap-2 rounded-full border-2 border-primary bg-primary px-8 text-base font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:scale-105"
                asChild
              >
                <a href="#join">
                  Get Early Access
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
            </div>

            <p className="mt-6 text-sm text-white/40">
              No credit card required · Cancel anytime
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
