"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Coffee, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the feedback to your server
    console.log("Feedback submitted:", { name, contact, feedback });
    // Reset form fields
    setName("");
    setContact("");
    setFeedback("");
    // You might want to show a success message here

    toast.success("Feedback submitted!", {
      description: "Thanks for sharing your thoughts 🤗",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Feedback and Support</h1>
      <p className="text-lg text-muted-foreground mb-8">
        I&apos;m excited to hear about what you&apos;re building with
        TokenTally&apos;s data! Your feedback is invaluable in helping me
        improve the site, expand the pricing data available, and enhance the
        overall user experience.
      </p>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Leave Feedback</CardTitle>
            <CardDescription>
              Share your thoughts, suggestions, or report issues
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmitFeedback}
              className="space-y-4"
            >
              <div className="space-y-1">
                <Label htmlFor="name">Name (optional)</Label>
                <Input
                  id="name"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="contact">Contact (optional)</Label>
                <Input
                  id="contact"
                  placeholder="Email or phone number"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="feedback">Your Feedback</Label>
                <Textarea
                  id="feedback"
                  placeholder="Tell us what you think or how you plan to use the data..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={5}
                />
              </div>
              <Button
                type="submit"
                className="w-full"
              >
                <Send className="h-4 w-4 mr-2" />
                Submit Feedback
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Support TokenTally</CardTitle>
            <CardDescription>
              Help keep this resource free and up-to-date
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              TokenTally is an independent project aimed at providing accurate,
              up-to-date, and ad-free information on AI model pricing.
            </p>

            <p className="text-muted-foreground">
              Your support helps maintain and improve this resource. If you find
              it useful, please consider treating me to a coffee ☕️ 💻
            </p>
            <p className="text-muted-foreground text-xs mt-auto">
              Thanks again for your support!
            </p>
            <a
              href="https://www.buymeacoffee.com/gfargo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              <Coffee className="h-5 w-5" />
              <span>Buy Me a Coffee</span>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
