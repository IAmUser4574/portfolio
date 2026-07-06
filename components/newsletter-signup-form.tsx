"use client";

import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Status = "idle" | "loading" | "success" | "error";

type NewsletterSignupFormProps = {
  variant?: "compact" | "prominent";
  className?: string;
};

export function NewsletterSignupForm({
  variant = "compact",
  className,
}: NewsletterSignupFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error(`subscribe failed: ${res.status}`);
      setStatus("success");
      setEmail("");
    } catch (err) {
      console.error("[newsletter-signup-form]", err);
      setStatus("error");
    }
  }

  const form = (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="email"
        required
        placeholder="your@email.com"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        disabled={status === "loading"}
        aria-label="Email address"
        className={variant === "prominent" ? "flex-1" : undefined}
      />
      <Button type="submit" size="sm" disabled={status === "loading"}>
        {status === "loading" ? "Subscribing..." : "Subscribe"}
      </Button>
    </form>
  );

  const message =
    status === "success" ? (
      <p className="mt-2 text-sm text-muted-foreground">You&apos;re subscribed — check your inbox.</p>
    ) : status === "error" ? (
      <p className="mt-2 text-sm text-destructive">Something went wrong. Try again in a moment.</p>
    ) : null;

  if (variant === "compact") {
    return (
      <div className={className}>
        {form}
        {message}
      </div>
    );
  }

  return (
    <Card className={cn("w-full py-4 sm:w-80", className)}>
      <CardContent className="space-y-3">
        <div>
          <p className="font-semibold whitespace-nowrap text-foreground">Get notified of new posts</p>
          <p className="text-sm text-muted-foreground">No spam, unsubscribe any time.</p>
        </div>
        {form}
        {message}
      </CardContent>
    </Card>
  );
}
