"use client"

import type { DailyFoodEntry } from "@/lib/types"

interface DailyEntriesProps {
  entries: DailyFoodEntry[]
  onRemove: (id: string) => void
}

export function DailyEntries({ entries, onRemove }: DailyEntriesProps) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No hay alimentos registrados aún</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {entries.map((entry) => (
        <div key={entry.id} className="bg-card p-4 rounded-lg border border-border flex justify-between items-center">
          <div>
            <p className="font-medium">{entry.foodName}</p>
            <p className="text-sm text-muted-foreground">{entry.quantity}g</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-semibold text-primary">{entry.calories} kcal</span>
            <button
              onClick={() => onRemove(entry.id)}
              className="text-destructive hover:text-destructive/80 text-sm font-medium"
            >
              Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
