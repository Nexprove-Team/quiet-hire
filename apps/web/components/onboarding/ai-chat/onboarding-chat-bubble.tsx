"use client";

import { motion } from "motion/react";
import {
  Avatar,
  AvatarFallback,
} from "@hackhyre/ui/components/avatar";
import { MagicStar, User } from "@hackhyre/ui/icons";
import { cn } from "@hackhyre/ui/lib/utils";

interface OnboardingChatBubbleProps {
  role: "user" | "assistant";
  content: string;
}

export function OnboardingChatBubble({
  role,
  content,
}: OnboardingChatBubbleProps) {
  const isAI = role === "assistant";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn("flex gap-2.5", !isAI && "flex-row-reverse")}
    >
      <Avatar className="h-7 w-7 shrink-0">
        <AvatarFallback
          className={cn(
            "text-[10px]",
            isAI
              ? "bg-primary/10 text-primary"
              : "bg-muted text-muted-foreground"
          )}
        >
          {isAI ? (
            <MagicStar size={14} variant="Bold" />
          ) : (
            <User size={14} variant="Bold" />
          )}
        </AvatarFallback>
      </Avatar>

      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
          isAI
            ? "bg-muted text-foreground rounded-tl-sm"
            : "bg-primary/10 text-foreground rounded-tr-sm"
        )}
      >
        {content}
      </div>
    </motion.div>
  );
}
