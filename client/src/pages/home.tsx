import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { piiTypes, type LogContent, logContentSchema } from "@shared/schema";
import { anonymizeText, highlightPii } from "@/lib/pii-detector";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Copy, Download } from "lucide-react";

export default function Home() {
  const { toast } = useToast();
  const [enabledTypes, setEnabledTypes] = useState<Record<string, boolean>>(
    Object.fromEntries(piiTypes.map(type => [type.id, type.enabled]))
  );
  
  const form = useForm<LogContent>({
    resolver: zodResolver(logContentSchema),
    defaultValues: {
      content: ""
    }
  });

  const content = form.watch("content");
  const [processedContent, setProcessedContent] = useState("");
  const [highlightedContent, setHighlightedContent] = useState("");

  useEffect(() => {
    if (content) {
      setProcessedContent(anonymizeText(content, enabledTypes));
      setHighlightedContent(highlightPii(content, enabledTypes));
    } else {
      setProcessedContent("");
      setHighlightedContent("");
    }
  }, [content, enabledTypes]);

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
          <h1 className="text-2xl font-bold">Log Anonymizer</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              disabled={!processedContent}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={downloadFile}
              disabled={!processedContent}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Form {...form}>
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Paste your log content here..."
                        className="font-mono h-[500px] resize-none"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </Form>

            <Card className="p-4">
              <div className="font-mono whitespace-pre-wrap text-sm">
                {processedContent ? (
                  processedContent
                ) : (
                  <span className="text-muted-foreground">
                    Anonymized output will appear here...
                  </span>
                )}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
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

            <Card className="p-4">
              <h2 className="text-lg font-semibold mb-4">Detected PII</h2>
              <div
                className="font-mono text-sm whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: highlightedContent || "No PII detected" }}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
