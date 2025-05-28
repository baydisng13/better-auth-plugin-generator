"use client";
import { SchemaField, SchemaTable, Hook, Middleware, RateLimit } from "@/app/page";


export const defaultField = (): SchemaField => ({
  id: Math.random().toString(36).substr(2, 9),
  name: "",
  type: "string",
  required: false,
  unique: false,
  reference: null,
});

export const defaultTable = (isNew = false): SchemaTable => ({
  id: Math.random().toString(36).substr(2, 9),
  name: isNew ? "" : "user",
  isNew,
  disableMigration: false,
  fields: [defaultField()],
});

export const defaultHook = (): Hook => ({
  id: Math.random().toString(36).substr(2, 9),
  name: "",
  timing: "before",
  action: "sign-up",
  customPath: "",
  matcher: "",
  logic: "const context = ctx;\n\n",
});

export const defaultMiddleware = (): Middleware => ({
  id: Math.random().toString(36).substr(2, 9),
  name: "",
  path: "",
  pathType: "exact",
  logic: "const context = ctx;\n\n",
});

export const defaultRateLimit = (): RateLimit => ({
  id: Math.random().toString(36).substr(2, 9),
  name: "",
  path: "",
  pathType: "exact",
  limit: 10,
  window: 60,
});
