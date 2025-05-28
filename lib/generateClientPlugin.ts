import { PluginConfig } from "@/app/page"

  const generateClientPlugin = (config: PluginConfig) => {
    const camelCaseName = config.name.replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ""))

    return `import { BetterAuthClientPlugin } from "better-auth/client";
import type { ${camelCaseName} } from "./index";

type ${camelCaseName.charAt(0).toUpperCase() + camelCaseName.slice(1)}Plugin = typeof ${camelCaseName};

/**
 * Client plugin for ${config.description || camelCaseName}
 */
export const ${camelCaseName}Client = () => {
  return {
    id: "${camelCaseName}",
    $InferServerPlugin: {} as ReturnType<${camelCaseName.charAt(0).toUpperCase() + camelCaseName.slice(1)}Plugin>,
  } satisfies BetterAuthClientPlugin;
};`
  }

  export default generateClientPlugin;