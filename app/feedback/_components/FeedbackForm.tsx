"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";

export const FeedbackForm = () => {
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
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
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
    </motion.div>
  );
};
