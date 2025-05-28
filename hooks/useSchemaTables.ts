import { PluginConfig, SchemaField, SchemaTable } from "@/app/page"
import { defaultField, defaultTable } from "@/lib/defaultField"

 function useSchemaTables(config: PluginConfig, setConfig: React.Dispatch<React.SetStateAction<PluginConfig>>) {
    const addTable = (isNew = false) => {
      setConfig((prev) => ({
        ...prev,
        tables: [...prev.tables, defaultTable(isNew)],
      }))
    }

    const removeTable = (tableId: string) => {
      setConfig((prev) => ({
        ...prev,
        tables: prev.tables.filter((table) => table.id !== tableId),
      }))
    }

    const updateTable = (tableId: string, updates: Partial<SchemaTable>) => {
      setConfig((prev) => ({
        ...prev,
        tables: prev.tables.map((table) => (table.id === tableId ? { ...table, ...updates } : table)),
      }))
    }

    const addField = (tableId: string) => {
      setConfig((prev) => ({
        ...prev,
        tables: prev.tables.map((table) =>
          table.id === tableId ? { ...table, fields: [...table.fields, defaultField()] } : table,
        ),
      }))
    }

    const removeField = (tableId: string, fieldId: string) => {
      setConfig((prev) => ({
        ...prev,
        tables: prev.tables.map((table) =>
          table.id === tableId ? { ...table, fields: table.fields.filter((field) => field.id !== fieldId) } : table,
        ),
      }))
    }

    const updateField = (tableId: string, fieldId: string, updates: Partial<SchemaField>) => {
      setConfig((prev) => ({
        ...prev,
        tables: prev.tables.map((table) =>
          table.id === tableId
            ? {
                ...table,
                fields: table.fields.map((field) => (field.id === fieldId ? { ...field, ...updates } : field)),
              }
            : table,
        ),
      }))
    }

    return { addTable, removeTable, updateTable, addField, removeField, updateField }
  }


export default useSchemaTables