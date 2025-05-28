"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Copy,
  Download,
  FileCode,
  Zap,
  Plus,
  Trash2,
  Code2,
  Clock,
  Shield,
  Layers,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import useSchemaTables from "@/hooks/useSchemaTables";
import useSchemaHooks from "@/hooks/useSchemaHooks";
import useSchemaMiddlewares from "@/hooks/useSchemaMiddlewares";
import useSchemaRateLimits from "@/hooks/useSchemaRateLimits";
import generateServerPlugin from "@/lib/generateServerPlugin";
import generateClientPlugin from "@/lib/generateClientPlugin";
import generateServerBootstrap from "@/lib/generateServerBootstrap";
import generateClientBootstrap from "@/lib/generateClientBootstrap";
import { copyToClipboard, downloadFile } from "@/lib/utils";
import CodeEditor from "@uiw/react-textarea-code-editor";
import rehypePrism from "rehype-prism-plus";
import rehypeRewrite from "rehype-rewrite";
export interface SchemaField {
  id: string;
  name: string;
  type: "string" | "number" | "boolean" | "date";
  required: boolean;
  unique: boolean;
  reference: {
    model: string;
    field: string;
    onDelete: string;
  } | null;
}

export interface SchemaTable {
  id: string;
  name: string;
  isNew: boolean;
  modelName?: string;
  disableMigration: boolean;
  fields: SchemaField[];
}

export interface Hook {
  id: string;
  name: string;
  timing: "before" | "after";
  action: "sign-up" | "sign-in" | "custom";
  customPath: string;
  matcher: string;
  logic: string;
}

export interface Middleware {
  id: string;
  name: string;
  path: string;
  pathType: "exact" | "pattern";
  logic: string;
}

export interface RateLimit {
  id: string;
  name: string;
  path: string;
  pathType: "exact" | "pattern";
  limit: number;
  window: number;
  key?: string;
}

export interface PluginConfig {
  name: string;
  description: string;
  tables: SchemaTable[];
  hooks: Hook[];
  middlewares: Middleware[];
  rateLimits: RateLimit[];
  generateServer: boolean;
  generateClient: boolean;
  addToBootstrap: boolean;
  runCLI: boolean;
}

export default function page() {
  const [config, setConfig] = useState<PluginConfig>({
    name: "",
    description: "",
    tables: [],
    hooks: [],
    middlewares: [],
    rateLimits: [],
    generateServer: true,
    generateClient: true,
    addToBootstrap: false,
    runCLI: false,
  });

  const [generatedCode, setGeneratedCode] = useState<{
    server: string;
    client: string;
    serverBootstrap: string;
    clientBootstrap: string;
  }>({
    server: "",
    client: "",
    serverBootstrap: "",
    clientBootstrap: "",
  });

  const {
    addTable,
    removeTable,
    updateTable,
    addField,
    removeField,
    updateField,
  } = useSchemaTables(config, setConfig);
  const { 
    addHook, 
    removeHook, 
    updateHook 
  } = useSchemaHooks(config, setConfig);
  const { 
    addMiddleware, 
    removeMiddleware, 
    updateMiddleware 
  } = useSchemaMiddlewares(config, setConfig);


  const { 
    addRateLimit, 
    removeRateLimit, 
    updateRateLimit 
  } = useSchemaRateLimits(config, setConfig);

  const handleGenerate = () => {
    setGeneratedCode({
      server: generateServerPlugin(config),
      client: generateClientPlugin(config),
      serverBootstrap: generateServerBootstrap(config),
      clientBootstrap: generateClientBootstrap(config),
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-40">
          <div className="flex items-center justify-center gap-2 mb-4">
            <h1 className="text-4xl font-bold text-gray-900">
              Better Auth Plugin Generator
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Generate custom Better Auth plugins with multiple tables, hooks,
            middleware, rate limiting, and type-safe client integration.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCode className="h-5 w-5" />
                Plugin Configuration
              </CardTitle>
              <CardDescription>
                Configure your plugin settings and generate both server and
                client code
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pluginName">Plugin Name</Label>
                  <Input
                    id="pluginName"
                    placeholder="e.g., birthdayPlugin, tosAgreementPlugin"
                    value={config.name}
                    onChange={(e) =>
                      setConfig({ ...config, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pluginDescription">
                    Description (optional)
                  </Label>
                  <Input
                    id="pluginDescription"
                    placeholder="Brief description of what this plugin does"
                    value={config.description}
                    onChange={(e) =>
                      setConfig({ ...config, description: e.target.value })
                    }
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="font-medium">Database Schema</Label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addTable(false)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Extend Table
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addTable(true)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      New Table
                    </Button>
                  </div>
                </div>

                {config.tables.length > 0 && (
                  <Accordion type="multiple" className="w-full">
                    {config.tables.map((table, tableIndex) => (
                      <AccordionItem key={table.id} value={table.id}>
                        <AccordionTrigger className="text-left">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={table.isNew ? "default" : "secondary"}
                            >
                              {table.isNew ? "New" : "Extend"}:{" "}
                              {table.name || "Unnamed Table"}
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Table Name</Label>
                              {table.isNew ? (
                                <Input
                                  placeholder="e.g., userProfile, settings"
                                  value={table.name}
                                  onChange={(e) =>
                                    updateTable(table.id, {
                                      name: e.target.value,
                                    })
                                  }
                                />
                              ) : (
                                <Select
                                  value={table.name}
                                  onValueChange={(value) =>
                                    updateTable(table.id, { name: value })
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="user">user</SelectItem>
                                    <SelectItem value="session">
                                      session
                                    </SelectItem>
                                    <SelectItem value="account">
                                      account
                                    </SelectItem>
                                    <SelectItem value="verification">
                                      verification
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              )}
                            </div>
                            {table.isNew && (
                              <div>
                                <Label>Model Name (optional)</Label>
                                <Input
                                  placeholder="Different name for the model"
                                  value={table.modelName || ""}
                                  onChange={(e) =>
                                    updateTable(table.id, {
                                      modelName: e.target.value,
                                    })
                                  }
                                />
                              </div>
                            )}
                          </div>

                          {table.isNew && (
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`disable-migration-${table.id}`}
                                checked={table.disableMigration}
                                onCheckedChange={(checked) =>
                                  updateTable(table.id, {
                                    disableMigration: !!checked,
                                  })
                                }
                              />
                              <Label htmlFor={`disable-migration-${table.id}`}>
                                Disable Migration
                              </Label>
                            </div>
                          )}

                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <Label className="text-sm font-medium">
                                Fields
                              </Label>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => addField(table.id)}
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                Add Field
                              </Button>
                            </div>

                            {table.fields.map((field, fieldIndex) => (
                              <div
                                key={field.id}
                                className="p-3 border rounded-lg space-y-3"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium">
                                    Field {fieldIndex + 1}
                                  </span>
                                  {table.fields.length > 1 && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        removeField(table.id, field.id)
                                      }
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  )}
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <Label className="text-xs">
                                      Field Name
                                    </Label>
                                    <Input
                                      placeholder="e.g., birthday, agreement"
                                      value={field.name}
                                      onChange={(e) =>
                                        updateField(table.id, field.id, {
                                          name: e.target.value,
                                        })
                                      }
                                    />
                                  </div>
                                  <div>
                                    <Label className="text-xs">Type</Label>
                                    <Select
                                      value={field.type}
                                      onValueChange={(value: any) =>
                                        updateField(table.id, field.id, {
                                          type: value,
                                        })
                                      }
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="string">
                                          String
                                        </SelectItem>
                                        <SelectItem value="number">
                                          Number
                                        </SelectItem>
                                        <SelectItem value="boolean">
                                          Boolean
                                        </SelectItem>
                                        <SelectItem value="date">
                                          Date
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>

                                <div className="flex gap-4">
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`required-${field.id}`}
                                      checked={field.required}
                                      onCheckedChange={(checked) =>
                                        updateField(table.id, field.id, {
                                          required: !!checked,
                                        })
                                      }
                                    />
                                    <Label
                                      htmlFor={`required-${field.id}`}
                                      className="text-xs"
                                    >
                                      Required
                                    </Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`unique-${field.id}`}
                                      checked={field.unique}
                                      onCheckedChange={(checked) =>
                                        updateField(table.id, field.id, {
                                          unique: !!checked,
                                        })
                                      }
                                    />
                                    <Label
                                      htmlFor={`unique-${field.id}`}
                                      className="text-xs"
                                    >
                                      Unique
                                    </Label>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`reference-${field.id}`}
                                      checked={!!field.reference}
                                      onCheckedChange={(checked) =>
                                        updateField(table.id, field.id, {
                                          reference: checked
                                            ? {
                                                model: "",
                                                field: "id",
                                                onDelete: "cascade",
                                              }
                                            : null,
                                        })
                                      }
                                    />
                                    <Label
                                      htmlFor={`reference-${field.id}`}
                                      className="text-xs"
                                    >
                                      Reference
                                    </Label>
                                  </div>

                                  {field.reference && (
                                    <div className="grid grid-cols-3 gap-2 ml-6">
                                      <Input
                                        placeholder="Table"
                                        value={field.reference.model}
                                        onChange={(e) =>
                                          updateField(table.id, field.id, {
                                            reference: {
                                              ...field.reference!,
                                              model: e.target.value,
                                            },
                                          })
                                        }
                                      />
                                      <Input
                                        placeholder="Field"
                                        value={field.reference.field}
                                        onChange={(e) =>
                                          updateField(table.id, field.id, {
                                            reference: {
                                              ...field.reference!,
                                              field: e.target.value,
                                            },
                                          })
                                        }
                                      />
                                      <Select
                                        value={field.reference.onDelete}
                                        onValueChange={(value) =>
                                          updateField(table.id, field.id, {
                                            reference: {
                                              ...field.reference!,
                                              onDelete: value,
                                            },
                                          })
                                        }
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="cascade">
                                            Cascade
                                          </SelectItem>
                                          <SelectItem value="set null">
                                            Set Null
                                          </SelectItem>
                                          <SelectItem value="restrict">
                                            Restrict
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>

                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeTable(table.id)}
                            className="w-full"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove Table
                          </Button>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="font-medium flex items-center gap-2">
                    <Layers className="h-4 w-4" />
                    Hooks
                  </Label>
                  <Button variant="outline" size="sm" onClick={addHook}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Hook
                  </Button>
                </div>

                {config.hooks.length > 0 && (
                  <Accordion type="multiple" className="w-full">
                    {config.hooks.map((hook, hookIndex) => (
                      <AccordionItem key={hook.id} value={hook.id}>
                        <AccordionTrigger className="text-left">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              {hook.timing}{" "}
                              {hook.action !== "custom"
                                ? hook.action
                                : "custom"}
                              : {hook.name || `Hook ${hookIndex + 1}`}
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4">
                          <div>
                            <Label>Hook Name</Label>
                            <Input
                              placeholder="e.g., Age Verification, TOS Check"
                              value={hook.name}
                              onChange={(e) =>
                                updateHook(hook.id, { name: e.target.value })
                              }
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Timing</Label>
                              <RadioGroup
                                value={hook.timing}
                                onValueChange={(value: any) =>
                                  updateHook(hook.id, { timing: value })
                                }
                                className="mt-2"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="before"
                                    id={`before-${hook.id}`}
                                  />
                                  <Label htmlFor={`before-${hook.id}`}>
                                    Before
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="after"
                                    id={`after-${hook.id}`}
                                  />
                                  <Label htmlFor={`after-${hook.id}`}>
                                    After
                                  </Label>
                                </div>
                              </RadioGroup>
                            </div>
                            <div>
                              <Label>Action</Label>
                              <RadioGroup
                                value={hook.action}
                                onValueChange={(value: any) =>
                                  updateHook(hook.id, { action: value })
                                }
                                className="mt-2"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="sign-up"
                                    id={`signup-${hook.id}`}
                                  />
                                  <Label htmlFor={`signup-${hook.id}`}>
                                    Sign-up
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="sign-in"
                                    id={`signin-${hook.id}`}
                                  />
                                  <Label htmlFor={`signin-${hook.id}`}>
                                    Sign-in
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="custom"
                                    id={`custom-${hook.id}`}
                                  />
                                  <Label htmlFor={`custom-${hook.id}`}>
                                    Custom
                                  </Label>
                                </div>
                              </RadioGroup>
                            </div>
                          </div>

                          {hook.action === "custom" && (
                            <div>
                              <Label>Custom Path</Label>
                              <Input
                                placeholder="/my-plugin/custom-endpoint"
                                value={hook.customPath}
                                onChange={(e) =>
                                  updateHook(hook.id, {
                                    customPath: e.target.value,
                                  })
                                }
                              />
                            </div>
                          )}

                          <div>
                            <Label>Custom Matcher (optional)</Label>
                            <Input
                              placeholder="e.g., context.headers.get('x-custom') === 'value'"
                              value={hook.matcher}
                              onChange={(e) =>
                                updateHook(hook.id, { matcher: e.target.value })
                              }
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                              Leave empty to use default path matching
                            </p>
                          </div>

                          <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                              <Code2 className="h-4 w-4" />
                              Hook Logic (TypeScript)
                            </Label>
                            <p className="text-xs text-muted-foreground mb-2">
                              this is the TypeScript code that will be executed
                              when the hook is triggered. this functions have
                              properties like ctx so u can access the request
                              context, headers, body, etc. here is a simple
                              example of a hook logic:

                            </p>
                            <CodeEditor
                              value={hook.logic}
                              language="ts"
                              placeholder="Please enter JS code."
                              onChange={(
                                e: React.ChangeEvent<HTMLTextAreaElement>
                              ) =>
                                updateHook(hook.id, { logic: e.target.value })
                              }
                              rehypePlugins={[
                                [
                                  rehypePrism,
                                  {
                                    ignoreMissing: true,
                                    language: "ts",
                                    showLineNumbers: true,
                                  },
                                ],
                                [rehypeRewrite],
                              ]}
                              padding={15}
                              className="bg-gray-900 text-white "
                              style={{
                                fontFamily:
                                  "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
                              }}
                            />
                          </div>

                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeHook(hook.id)}
                            className="w-full"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove Hook
                          </Button>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="font-medium flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Middleware
                  </Label>
                  <Button variant="outline" size="sm" onClick={addMiddleware}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Middleware
                  </Button>
                </div>

                {config.middlewares.length > 0 && (
                  <Accordion type="multiple" className="w-full">
                    {config.middlewares.map((middleware, middlewareIndex) => (
                      <AccordionItem key={middleware.id} value={middleware.id}>
                        <AccordionTrigger className="text-left">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              {middleware.path || "/path"}:{" "}
                              {middleware.name ||
                                `Middleware ${middlewareIndex + 1}`}
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4">
                          <div>
                            <Label>Middleware Name</Label>
                            <Input
                              placeholder="e.g., Auth Check, Rate Limiter"
                              value={middleware.name}
                              onChange={(e) =>
                                updateMiddleware(middleware.id, {
                                  name: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Path</Label>
                              <Input
                                placeholder="/my-plugin/protected"
                                value={middleware.path}
                                onChange={(e) =>
                                  updateMiddleware(middleware.id, {
                                    path: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div>
                              <Label>Path Type</Label>
                              <Select
                                value={middleware.pathType}
                                onValueChange={(value: any) =>
                                  updateMiddleware(middleware.id, {
                                    pathType: value,
                                  })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="exact">
                                    Exact Match
                                  </SelectItem>
                                  <SelectItem value="pattern">
                                    Pattern Match
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                              <Code2 className="h-4 w-4" />
                              Middleware Logic (TypeScript)
                            </Label>

                            <p className="text-xs text-muted-foreground mb-2">
                              this is the TypeScript code that will be executed
                              when the middleware is triggered. you can access the
                              request context, headers, body, etc. 
                              </p>

                               <CodeEditor
                              value={middleware.logic}
                              language="ts"
                              placeholder="Please enter JS code."
                              onChange={(
                                e: React.ChangeEvent<HTMLTextAreaElement>
                              ) =>
                                updateMiddleware(middleware.id, {
                                  logic: e.target.value,
                                })
                              }
                              rehypePlugins={[
                                [
                                  rehypePrism,
                                  {
                                    ignoreMissing: true,
                                    language: "ts",
                                    showLineNumbers: true,
                                  },
                                ],
                                [rehypeRewrite],
                              ]}
                              padding={15}
                              className="bg-gray-900 text-white "
                              style={{
                                fontFamily:
                                  "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
                              }}
                            />

                            
                          </div>

                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeMiddleware(middleware.id)}
                            className="w-full"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove Middleware
                          </Button>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Rate Limiting
                  </Label>
                  <Button variant="outline" size="sm" onClick={addRateLimit}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Rate Limit
                  </Button>
                </div>

                {config.rateLimits.length > 0 && (
                  <Accordion type="multiple" className="w-full">
                    {config.rateLimits.map((rateLimit, rateLimitIndex) => (
                      <AccordionItem key={rateLimit.id} value={rateLimit.id}>
                        <AccordionTrigger className="text-left">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              {rateLimit.path || "/path"}: {rateLimit.limit}/
                              {rateLimit.window}s -{" "}
                              {rateLimit.name ||
                                `Rate Limit ${rateLimitIndex + 1}`}
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4">
                          <div>
                            <Label>Rate Limit Name</Label>
                            <Input
                              placeholder="e.g., API Limit, Login Attempts"
                              value={rateLimit.name}
                              onChange={(e) =>
                                updateRateLimit(rateLimit.id, {
                                  name: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Path</Label>
                              <Input
                                placeholder="/my-plugin/api-endpoint"
                                value={rateLimit.path}
                                onChange={(e) =>
                                  updateRateLimit(rateLimit.id, {
                                    path: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div>
                              <Label>Path Type</Label>
                              <Select
                                value={rateLimit.pathType}
                                onValueChange={(value: any) =>
                                  updateRateLimit(rateLimit.id, {
                                    pathType: value,
                                  })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="exact">
                                    Exact Match
                                  </SelectItem>
                                  <SelectItem value="pattern">
                                    Pattern Match
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Limit (requests)</Label>
                              <Input
                                type="number"
                                value={rateLimit.limit}
                                onChange={(e) =>
                                  updateRateLimit(rateLimit.id, {
                                    limit:
                                      Number.parseInt(e.target.value) || 10,
                                  })
                                }
                              />
                            </div>
                            <div>
                              <Label>Window (seconds)</Label>
                              <Input
                                type="number"
                                value={rateLimit.window}
                                onChange={(e) =>
                                  updateRateLimit(rateLimit.id, {
                                    window:
                                      Number.parseInt(e.target.value) || 60,
                                  })
                                }
                              />
                            </div>
                          </div>

                          <div>
                            <Label>Custom Key (optional)</Label>
                            <Input
                              placeholder="e.g., user-id, ip-address"
                              value={rateLimit.key || ""}
                              onChange={(e) =>
                                updateRateLimit(rateLimit.id, {
                                  key: e.target.value,
                                })
                              }
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                              Leave empty to use default rate limiting key
                            </p>
                          </div>

                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeRateLimit(rateLimit.id)}
                            className="w-full"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove Rate Limit
                          </Button>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </div>

              <Separator />

              <div className="space-y-4">
                <Label className="font-medium">Output Options</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="generateServer"
                      checked={config.generateServer}
                      onCheckedChange={(checked) =>
                        setConfig({ ...config, generateServer: !!checked })
                      }
                    />
                    <Label htmlFor="generateServer">
                      Generate server plugin (index.ts)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="generateClient"
                      checked={config.generateClient}
                      onCheckedChange={(checked) =>
                        setConfig({ ...config, generateClient: !!checked })
                      }
                    />
                    <Label htmlFor="generateClient">
                      Generate client plugin (client.ts)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="addToBootstrap"
                      checked={config.addToBootstrap}
                      onCheckedChange={(checked) =>
                        setConfig({ ...config, addToBootstrap: !!checked })
                      }
                    />
                    <Label htmlFor="addToBootstrap">
                      Add plugin to bootstrap files
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="runCLI"
                      checked={config.runCLI}
                      onCheckedChange={(checked) =>
                        setConfig({ ...config, runCLI: !!checked })
                      }
                    />
                    <Label htmlFor="runCLI">Run CLI to sync schemas</Label>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleGenerate}
                className="w-full"
                size="lg"
                disabled={!config.name.trim()}
              >
                <Zap className="h-4 w-4 mr-2" />
                Generate Plugin
              </Button>
            </CardContent>
          </Card>

          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Generated Code</CardTitle>
              <CardDescription>
                Your plugin files are ready to use
              </CardDescription>
            </CardHeader>
            <CardContent>
              {generatedCode.server ? (
                <Tabs defaultValue="server" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="server">Server</TabsTrigger>
                    <TabsTrigger value="client">Client</TabsTrigger>
                    <TabsTrigger value="server-bootstrap">
                      Server Setup
                    </TabsTrigger>
                    <TabsTrigger value="client-bootstrap">
                      Client Setup
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="server" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">index.ts</Badge>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(generatedCode.server)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            downloadFile(generatedCode.server, "index.ts")
                          }
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="relative">
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto border max-h-96">
                        <code className="language-typescript">
                          {generatedCode.server}
                        </code>
                      </pre>
                    </div>
                  </TabsContent>

                  <TabsContent value="client" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">client.ts</Badge>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(generatedCode.client)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            downloadFile(generatedCode.client, "client.ts")
                          }
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="relative">
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto border max-h-96">
                        <code className="language-typescript">
                          {generatedCode.client}
                        </code>
                      </pre>
                    </div>
                  </TabsContent>

                  <TabsContent value="server-bootstrap" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">server.ts</Badge>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(generatedCode.serverBootstrap)
                          }
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            downloadFile(
                              generatedCode.serverBootstrap,
                              "server.ts"
                            )
                          }
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="relative">
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto border max-h-96">
                        <code className="language-typescript">
                          {generatedCode.serverBootstrap}
                        </code>
                      </pre>
                    </div>
                  </TabsContent>

                  <TabsContent value="client-bootstrap" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">auth-client.ts</Badge>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(generatedCode.clientBootstrap)
                          }
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            downloadFile(
                              generatedCode.clientBootstrap,
                              "auth-client.ts"
                            )
                          }
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="relative">
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto border max-h-96">
                        <code className="language-typescript">
                          {generatedCode.clientBootstrap}
                        </code>
                      </pre>
                    </div>
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <FileCode className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>
                    Configure your plugin settings and click "Generate Plugin"
                    to see the code
                  </p>
                </div>
              )}

              {generatedCode.server && config.runCLI && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">
                    Next Steps:
                  </h4>
                  <ol className="text-sm text-blue-800 space-y-1">
                    <li>1. Save the generated files to your project</li>
                    <li>
                      2. Run:{" "}
                      <code className="bg-blue-100 px-1 rounded">
                        npx @better-auth/cli@latest generate
                      </code>
                    </li>
                    <li>3. Update your database schema</li>
                    <li>4. Import and use your new plugin!</li>
                  </ol>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
