"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/hooks/use-current-user";
import { cn } from "@/lib/utils";
import { createClient } from "@/supabase/client";
import { useEffect, useRef, useState } from "react";

interface Message {
  role: string;
  content: string;
}

export function ExampleAIChat() {
  const supabase = createClient();
  const { uid } = useCurrentUser();
  const [messages, setMessages] = useState<Message[]>([
    { role: "user", content: "Hi" },
    { role: "assistant", content: "Hi there! How can I help you today?" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [credits, setCredits] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedValue = inputValue.trim();
    if (!uid) return;
    if (!trimmedValue) return;

    try {
      const { error: deductError } = await supabase.rpc("revoke_credits", {
        p_user_id: uid,
        p_amount: 100,
        p_type: "usage",
        p_reference: undefined,
        p_description: "AI generation",
      });

      if (deductError) {
        alert("Not enough credits. Please subscribe at /plans.");
        return;
      }

      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "user", content: trimmedValue },
        { role: "assistant", content: "HA you caught me" },
      ]);
      setInputValue("");

      const { data } = await supabase
        .from("credit_balances")
        .select("balance")
        .eq("user_id", uid)
        .single();
      setCredits(data?.balance ?? 0);
    } catch {
      alert("Not enough credits or an error occurred. Message not sent.");
    }
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchCredits = async () => {
      if (!uid) return;
      const { data } = await supabase
        .from("credit_balances")
        .select("balance")
        .eq("user_id", uid)
        .single();
      setCredits(data?.balance ?? 0);
      setIsLoading(false);
    };
    fetchCredits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto min-h-full">
      <Card className="min-h-full">
        <CardHeader>
          <CardTitle>Completly real SUPACREEM AI</CardTitle>
          <CardDescription>
            (so good each message costs 100 credits)
          </CardDescription>
          <CardAction>
            {isLoading ? (
              <p className="text-muted-foreground text-xs max-w-xs">
                Loading...
              </p>
            ) : credits > 0 ? (
              <p className="text-muted-foreground text-xs max-w-xs">
                {credits} credits remaining
              </p>
            ) : (
              <p className="text-destructive text-xs max-w-xs">
                Out of credits, please subscribe at /plans or top-up at /wallet
              </p>
            )}
          </CardAction>
        </CardHeader>
        <CardContent className="mt-auto px-0">
          <div
            className="flex flex-col gap-2 max-h-[500px] overflow-y-auto px-4"
            style={{ scrollbarGutter: "stable both-edges" }}
          >
            {messages.map((message, index) => (
              <div
                ref={index === messages.length - 1 ? messagesEndRef : null}
                key={index}
                className={cn(
                  "flex items-start gap-2",
                  message.role === "user" ? "flex-row-reverse" : "",
                )}
              >
                <div
                  className={cn(
                    "rounded-lg px-4 py-2",
                    { "bg-blue-300 dark:bg-blue-700": message.role === "user" },
                    { "bg-gray-300 dark:bg-gray-700": message.role !== "user" },
                  )}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>
          <div ref={messagesEndRef} />
          <form onSubmit={handleSubmit} className="flex mt-4 gap-4 px-4">
            <Input
              placeholder="Type your message..."
              value={inputValue}
              onChange={handleInputChange}
              disabled={credits <= 0}
            />
            <Button size="lg" disabled={credits <= 0}>
              Send
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground self-center text-right">
            &copy; SUPACREEM CO
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
