import { PluginConfig } from "@/app/page"

 const generateServerPlugin = (config: PluginConfig) => {
    const camelCaseName = config.name.replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ""))

    let imports = `import type { BetterAuthPlugin } from "better-auth";`

    if (config.hooks.length > 0 || config.middlewares.length > 0) {
      imports += `\nimport { createAuthMiddleware } from "better-auth/plugins";`
    }

    if (config.hooks.length > 0 || config.middlewares.length > 0) {
      imports += `\nimport { APIError } from "better-auth/api";`
    }

    // Generate schema
    let schema = ""
    if (config.tables.length > 0) {
      const schemaEntries = config.tables
        .map((table) => {
          const fields = table.fields
            .filter((field) => field.name.trim())
            .map((field) => {
              let fieldDef = `
          ${field.name}: {
            type: "${field.type}",
            required: ${field.required},
            unique: ${field.unique},`

              if (field.reference) {
                fieldDef += `
            reference: {
              model: "${field.reference.model}",
              field: "${field.reference.field}",
              onDelete: "${field.reference.onDelete}"
            }`
              } else {
                fieldDef += `
            reference: null`
              }

              fieldDef += `
          },`
              return fieldDef
            })
            .join("")

          let tableDef = `
        ${table.name}: {
          fields: {${fields}
          },`

          if (table.modelName && table.modelName !== table.name) {
            tableDef += `
          modelName: "${table.modelName}",`
          }

          if (table.disableMigration) {
            tableDef += `
          disableMigration: true,`
          }

          tableDef += `
        },`

          return tableDef
        })
        .join("")

      schema = `
    schema: {${schemaEntries}
    },`
    }

    // Generate hooks
    let hooks = ""
    if (config.hooks.length > 0) {
      const beforeHooks = config.hooks
        .filter((hook) => hook.timing === "before")
        .map((hook) => {
          const endpoint =
            hook.action === "custom" ? hook.customPath : hook.action === "sign-up" ? "/sign-up/email" : "/sign-in/email"

          const matcher = hook.matcher || `context.path.startsWith("${endpoint}")`

          const hookLogic =
            hook.logic ||
            `
            // ${hook.name || "Hook"} logic
            console.log("Hook triggered for:", ctx.path);
            
            // Add your custom logic here
            // const { data } = ctx.body;`

          return `
        {
          // ${hook.name || "Unnamed Hook"}
          matcher: (context) => ${matcher},
          handler: createAuthMiddleware(async (ctx) => {${hookLogic}
            
            return { context: ctx };
          }),
        },`
        })
        .join("")

      const afterHooks = config.hooks
        .filter((hook) => hook.timing === "after")
        .map((hook) => {
          const endpoint =
            hook.action === "custom" ? hook.customPath : hook.action === "sign-up" ? "/sign-up/email" : "/sign-in/email"

          const matcher = hook.matcher || `context.path.startsWith("${endpoint}")`

          const hookLogic =
            hook.logic ||
            `
            // ${hook.name || "Hook"} logic
            console.log("After hook triggered for:", ctx.path);
            
            // Add your custom logic here`

          return `
        {
          // ${hook.name || "Unnamed Hook"}
          matcher: (context) => ${matcher},
          handler: async (ctx) => {${hookLogic}
            
            // Return modified response if needed
            // return ctx.json({ message: "Modified response" });
          },
        },`
        })
        .join("")

      if (beforeHooks || afterHooks) {
        hooks = `
    hooks: {${
      beforeHooks
        ? `
      before: [${beforeHooks}
      ],`
        : ""
    }${
      afterHooks
        ? `
      after: [${afterHooks}
      ],`
        : ""
    }
    },`
      }
    }

    // Generate middlewares
    let middlewares = ""
    if (config.middlewares.length > 0) {
      const middlewareEntries = config.middlewares
        .filter((middleware) => middleware.path.trim())
        .map((middleware) => {
          const middlewareLogic =
            middleware.logic ||
            `
            // ${middleware.name || "Middleware"} logic
            console.log("Middleware triggered for:", ctx.path);
            
            // Add your middleware logic here
            // Example: Check authorization
            // const authHeader = ctx.headers.get("authorization");
            // if (!authHeader) {
            //   throw new APIError("UNAUTHORIZED", { message: "Missing authorization header" });
            // }`

          return `
      {
        // ${middleware.name || "Unnamed Middleware"}
        path: "${middleware.path}",
        middleware: createAuthMiddleware(async (ctx) => {${middlewareLogic}
        }),
      },`
        })
        .join("")

      middlewares = `
    middlewares: [${middlewareEntries}
    ],`
    }

    // Generate rate limits
    let rateLimits = ""
    if (config.rateLimits.length > 0) {
      const rateLimitEntries = config.rateLimits
        .filter((rateLimit) => rateLimit.path.trim())
        .map((rateLimit) => {
          const pathMatcher =
            rateLimit.pathType === "exact" ? `path === "${rateLimit.path}"` : `path.startsWith("${rateLimit.path}")`

          return `
      {
        // ${rateLimit.name || "Unnamed Rate Limit"}
        pathMatcher: (path) => ${pathMatcher},
        limit: ${rateLimit.limit},
        window: ${rateLimit.window},${
          rateLimit.key
            ? `
        key: "${rateLimit.key}",`
            : ""
        }
      },`
        })
        .join("")

      rateLimits = `
    rateLimit: [${rateLimitEntries}
    ],`
    }

    return `${imports}

/**
 * ${config.description || `${camelCaseName} plugin for Better Auth`}
 */
export const ${camelCaseName} = () =>
  ({
    id: "${camelCaseName}",${schema}${hooks}${middlewares}${rateLimits}
  } satisfies BetterAuthPlugin);`
  }

  export default generateServerPlugin