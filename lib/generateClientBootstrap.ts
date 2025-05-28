import { PluginConfig } from "@/app/page";

  const generateClientBootstrap = (config: PluginConfig) => {
    const camelCaseName = config.name.replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ""))
    const kebabCaseName = config.name
      .replace(/([a-z])([A-Z])/g, "$1-$2")
      .toLowerCase()
      .replace(/[_\s]+/g, "-")

    return `import { createAuthClient } from "better-auth/client";
import { ${camelCaseName}Client } from "./${kebabCaseName}-plugin/client";

const authClient = createAuthClient({
  plugins: [
    ${camelCaseName}Client(),
    // ... other plugins
  ]
});`
  }


  export default generateClientBootstrap;