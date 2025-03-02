import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Coffee } from "lucide-react";
import { FeedbackForm } from "./_components/FeedbackForm";
import { metadata } from "./metadata";

export { metadata };

export default function FeedbackPage() {
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
            <FeedbackForm />
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
