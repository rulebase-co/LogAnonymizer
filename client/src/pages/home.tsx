import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  piiTypes, 
  aiProviders,
  type LogContent, 
  type ProviderConfig,
  logContentSchema,
  providerConfigSchema 
} from "@shared/schema";
import { anonymizeText, highlightPii } from "@/lib/pii-detector";
import { anonymizeWithAI } from "@/lib/ai-providers";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Copy, Download, Upload } from "lucide-react";

export default function Home() {
  const { toast } = useToast();
  const [enabledTypes, setEnabledTypes] = useState<Record<string, boolean>>(
    Object.fromEntries(piiTypes.map(type => [type.id, type.enabled]))
  );

  const [providerConfig, setProviderConfig] = useState<ProviderConfig>({
    provider: "openai",
    apiKey: ""
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const form = useForm<LogContent>({
    resolver: zodResolver(logContentSchema),
    defaultValues: {
      content: "",
      file: undefined
    }
  });

  const content = form.watch("content");
  const [processedContent, setProcessedContent] = useState("");
  const [highlightedContent, setHighlightedContent] = useState("");

  const processContent = useCallback(async (text: string) => {
    if (!text) {
      setProcessedContent("");
      setHighlightedContent("");
      return;
    }

    try {
      setIsProcessing(true);

      if (providerConfig.apiKey) {
        // Use AI provider if configured
        const aiProcessed = await anonymizeWithAI(text, providerConfig);
        setProcessedContent(aiProcessed);
        setHighlightedContent(highlightPii(text, enabledTypes));
      } else {
        // Fallback to regex-based detection
        setProcessedContent(anonymizeText(text, enabledTypes));
        setHighlightedContent(highlightPii(text, enabledTypes));
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process content",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  }, [providerConfig, enabledTypes, toast]);

  useEffect(() => {
    processContent(content);
  }, [content, processContent]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      form.setValue("content", text);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to read file",
        variant: "destructive"
      });
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(processedContent);
      toast({
        title: "Copied!",
        description: "Anonymized content copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const downloadFile = () => {
    const blob = new Blob([processedContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "anonymized-log.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">Log Anonymizer</h1>
            <p className="text-sm text-muted-foreground">
              <a 
                href="https://github.com/your-username/log-anonymizer#readme" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                View Documentation
              </a>
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              disabled={!processedContent || isProcessing}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={downloadFile}
              disabled={!processedContent || isProcessing}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left Settings Panel */}
          <div className="col-span-12 lg:col-span-3 space-y-6">
            <Card className="p-4">
              <h2 className="text-lg font-semibold mb-4">AI Provider</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Provider</label>
                  <Select
                    value={providerConfig.provider}
                    onValueChange={(value) =>
                      setProviderConfig((prev) => ({ ...prev, provider: value as any }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {aiProviders.map((provider) => (
                        <SelectItem key={provider.id} value={provider.id}>
                          {provider.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">API Key</label>
                  <Input
                    type="password"
                    value={providerConfig.apiKey}
                    onChange={(e) =>
                      setProviderConfig((prev) => ({
                        ...prev,
                        apiKey: e.target.value,
                      }))
                    }
                    placeholder="Enter your API key"
                  />
                </div>

                {providerConfig.provider === "azure" && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Endpoint</label>
                      <Input
                        value={providerConfig.endpoint || ""}
                        onChange={(e) =>
                          setProviderConfig((prev) => ({
                            ...prev,
                            endpoint: e.target.value,
                          }))
                        }
                        placeholder="Azure OpenAI endpoint"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Deployment Name</label>
                      <Input
                        value={providerConfig.deploymentName || ""}
                        onChange={(e) =>
                          setProviderConfig((prev) => ({
                            ...prev,
                            deploymentName: e.target.value,
                          }))
                        }
                        placeholder="Azure deployment name"
                      />
                    </div>
                  </>
                )}
              </div>
            </Card>

            <Card className="p-4">
              <h2 className="text-lg font-semibold mb-4">PII Detection</h2>
              <div className="space-y-4">
                {piiTypes.map((type) => (
                  <div
                    key={type.id}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm">{type.label}</span>
                    <Switch
                      checked={enabledTypes[type.id]}
                      onCheckedChange={(checked) =>
                        setEnabledTypes((prev) => ({
                          ...prev,
                          [type.id]: checked,
                        }))
                      }
                    />
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="col-span-12 lg:col-span-9 space-y-6">
            {/* File Upload and Input */}
            <Card className="p-4">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Input
                    type="file"
                    accept=".txt,.log"
                    onChange={handleFileUpload}
                    className="flex-1"
                  />
                  <Button variant="outline" size="icon" asChild>
                    <label>
                      <Upload className="h-4 w-4" />
                      <input
                        type="file"
                        className="sr-only"
                        accept=".txt,.log"
                        onChange={handleFileUpload}
                      />
                    </label>
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Original Content */}
                  <div className="space-y-2">
                    <h3 className="font-medium">Original Content</h3>
                    <Form {...form}>
                      <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea
                                placeholder="Paste your log content here..."
                                className="font-mono h-[400px] resize-none"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </Form>
                  </div>

                  {/* Anonymized Content */}
                  <div className="space-y-2">
                    <h3 className="font-medium">Anonymized Content</h3>
                    <div className="relative">
                      <Textarea
                        value={processedContent}
                        readOnly
                        className="font-mono h-[400px] resize-none"
                        placeholder="Anonymized output will appear here..."
                      />
                      {isProcessing && (
                        <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                          <span className="text-muted-foreground">Processing...</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* PII Detection Preview */}
            <Card className="p-4">
              <h2 className="text-lg font-semibold mb-4">Detected PII</h2>
              <div
                className="font-mono text-sm whitespace-pre-wrap"
                dangerouslySetInnerHTML={{
                  __html: highlightedContent || "No PII detected",
                }}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}