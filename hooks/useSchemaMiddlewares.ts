import { Middleware, PluginConfig } from "@/app/page"
import { defaultMiddleware } from "@/lib/defaultField"

 function useSchemaMiddlewares(config: PluginConfig, setConfig: React.Dispatch<React.SetStateAction<PluginConfig>>) {
    const addMiddleware = () => {
      setConfig({
        ...config,
        middlewares: [...config.middlewares, defaultMiddleware()],
      })
    }

    const removeMiddleware = (middlewareId: string) => {
      setConfig({
        ...config,
        middlewares: config.middlewares.filter((middleware) => middleware.id !== middlewareId),
      })
    }

    const updateMiddleware = (middlewareId: string, updates: Partial<Middleware>) => {
      setConfig({
        ...config,
        middlewares: config.middlewares.map((middleware) =>
          middleware.id === middlewareId ? { ...middleware, ...updates } : middleware,
        ),
      })
    }

    return { addMiddleware, removeMiddleware, updateMiddleware }
  }


  export default useSchemaMiddlewares