import { z } from "zod";

export const piiTypes = [
  { id: "email", label: "Email Addresses", enabled: true },
  { id: "phone", label: "Phone Numbers", enabled: true },
  { id: "ip", label: "IP Addresses", enabled: true },
  { id: "creditCard", label: "Credit Card Numbers", enabled: true },
  { id: "ssn", label: "Social Security Numbers", enabled: true },
  { id: "name", label: "Names", enabled: true },
  { id: "address", label: "Addresses", enabled: true }
] as const;

export type PiiType = typeof piiTypes[number]["id"];

export const logContentSchema = z.object({
  content: z.string().min(1, "Log content is required"),
});

export type LogContent = z.infer<typeof logContentSchema>;

export const piiConfigSchema = z.object({
  types: z.record(z.string(), z.boolean())
});

export type PiiConfig = z.infer<typeof piiConfigSchema>;
