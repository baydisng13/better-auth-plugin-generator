import { PluginConfig } from "@/app/page";

 const generateServerBootstrap = (config: PluginConfig) => {
    const camelCaseName = config.name.replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ""))
    const kebabCaseName = config.name
      .replace(/([a-z])([A-Z])/g, "$1-$2")
      .toLowerCase()
      .replace(/[_\s]+/g, "-")

    return `import { betterAuth } from "better-auth";
import { ${camelCaseName} } from "./${kebabCaseName}-plugin";

export const auth = betterAuth({
  plugins: [
    ${camelCaseName}(),
    // ... other plugins
  ]
});`
  }

  export default generateServerBootstrap;