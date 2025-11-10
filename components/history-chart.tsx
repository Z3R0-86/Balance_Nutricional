"use client"

import type { DailyRecord } from "@/lib/types"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface HistoryChartProps {
  records: DailyRecord[]
}

export function HistoryChart({ records }: HistoryChartProps) {
  if (records.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No hay historial de registros aún</p>
      </div>
    )
  }

  const chartData = records.map((record) => ({
    date: new Date(record.date).toLocaleDateString("es-ES", { month: "short", day: "numeric" }),
    consumidas: record.totalCalories,
    meta: record.dailyGoal,
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
        <XAxis dataKey="date" stroke="currentColor" opacity={0.5} />
        <YAxis stroke="currentColor" opacity={0.5} />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--card)",
            border: `1px solid var(--border)`,
            borderRadius: "8px",
            color: "var(--foreground)",
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="consumidas"
          stroke="var(--primary)"
          strokeWidth={2}
          dot={{ fill: "var(--primary)", r: 4 }}
          name="Consumidas"
        />
        <Line
          type="monotone"
          dataKey="meta"
          stroke="var(--muted-foreground)"
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={{ fill: "var(--muted-foreground)", r: 4 }}
          name="Meta"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
