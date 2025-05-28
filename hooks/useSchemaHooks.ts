import { Hook, PluginConfig } from "@/app/page"
import { defaultHook } from "@/lib/defaultField"

 function useSchemaHooks(config: PluginConfig, setConfig: React.Dispatch<React.SetStateAction<PluginConfig>>) {
    const addHook = () => {
      setConfig((prev) => ({
        ...prev,
        hooks: [...prev.hooks, defaultHook()],
      }))
    }

    const removeHook = (hookId: string) => {
      setConfig((prev) => ({
        ...prev,
        hooks: prev.hooks.filter((hook) => hook.id !== hookId),
      }))
    }

    const updateHook = (hookId: string, updates: Partial<Hook>) => {
      setConfig((prev) => ({
        ...prev,
        hooks: prev.hooks.map((hook) => (hook.id === hookId ? { ...hook, ...updates } : hook)),
      }))
    }

    return { addHook, removeHook, updateHook }
  }

  export default useSchemaHooks