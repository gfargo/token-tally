"use client";

import { FeedbackForm } from "@/app/feedback/_components/FeedbackForm";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronDown, ChevronUp, Coffee, Heart } from "lucide-react";
import { useState } from "react";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Thank you for using TokenTally!</DialogTitle>
          <DialogDescription>
            We hope the data you&apos;ve downloaded will be useful for your
            project.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <p className="text-sm text-muted-foreground">
            We&apos;d love to hear about what you&apos;re building or how you
            plan to use this data. Your feedback helps us improve and expand our
            services.
          </p>
          <div className="flex flex-wrap flex-col gap-2">
            {/*
            <a
              href="https://griffen.codes"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Globe className="h-4 w-4" />
              <span>griffen.codes</span>
            </a>
            <a
              href="https://github.com/gfargo/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Github className="h-4 w-4" />
              <span>gfargo</span>
            </a>
            <a
              href="https://github.com/gfargo/tokentally"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Github className="h-4 w-4" />
              <span>Project Repo</span>
            </a>*/}
            <a
              href="https://www.buymeacoffee.com/gfargo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Coffee className="h-4 w-4" />
              <span>Buy Me a Coffee</span>
            </a>
          </div>
          <Collapsible
            open={isFormOpen}
            onOpenChange={setIsFormOpen}
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setIsFormOpen(!isFormOpen)}
              >
                {isFormOpen ? "Hide Feedback Form" : "Leave Feedback"}
                {isFormOpen ? (
                  <ChevronUp className="h-4 w-4 ml-2" />
                ) : (
                  <ChevronDown className="h-4 w-4 ml-2" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4">
              <FeedbackForm />
            </CollapsibleContent>
          </Collapsible>
        </div>
        <DialogFooter className="sm:justify-start">
          {/*
          <Button
            variant="outline"
            onClick={onClose}
          >
            Close
          </Button>
          */}
          <a
            href="https://github.com/gfargo/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors ml-auto"
          >
            <span>from griffen.codes</span>
            <Heart className="h-4 w-4" />
          </a>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
