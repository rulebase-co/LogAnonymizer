import { z } from "zod";

export const piiTypes = [
  { id: "timestamp", label: "Timestamps", enabled: true },
  { id: "userId", label: "User IDs", enabled: true },
  { id: "email", label: "Email Addresses", enabled: true },
  { id: "phone", label: "Phone Numbers", enabled: true },
  { id: "ip", label: "IP Addresses", enabled: true },
  { id: "creditCard", label: "Credit Card Numbers", enabled: true },
  { id: "ssn", label: "Social Security Numbers", enabled: true },
  { id: "name", label: "Customer Names", enabled: true },
  { id: "address", label: "Addresses (Replace with Fiction)", enabled: true }
] as const;

export type PiiType = typeof piiTypes[number]["id"];

export const aiProviders = [
  { id: "openai", label: "OpenAI" },
  { id: "anthropic", label: "Anthropic" },
  { id: "google", label: "Google AI" },
  { id: "azure", label: "Azure OpenAI" }
] as const;

export type AiProvider = typeof aiProviders[number]["id"];

export const providerConfigSchema = z.object({
  provider: z.enum(aiProviders.map(p => p.id) as [string, ...string[]]),
  apiKey: z.string().min(1, "API key is required"),
  endpoint: z.string().optional(),
  deploymentName: z.string().optional()
});

export type ProviderConfig = z.infer<typeof providerConfigSchema>;

export const logContentSchema = z.object({
  content: z.string().min(1, "Log content is required"),
  file: z.instanceof(File).optional()
});

export type LogContent = z.infer<typeof logContentSchema>;

export const piiConfigSchema = z.object({
  types: z.record(z.string(), z.boolean())
});

export type PiiConfig = z.infer<typeof piiConfigSchema>;