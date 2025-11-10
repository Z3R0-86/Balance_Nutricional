"use client"

interface CalorieGoalDisplayProps {
  dailyGoal: number
  consumed: number
  message: string
}

export function CalorieGoalDisplay({ dailyGoal, consumed, message }: CalorieGoalDisplayProps) {
  const remaining = dailyGoal - consumed
  const percentage = Math.min((consumed / dailyGoal) * 100, 100)
  const isOverGoal = consumed > dailyGoal

  return (
    <div className="space-y-6">
  {/* Progreso circular */}
      <div className="flex justify-center">
        <div className="relative w-48 h-48">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {/* Círculo de fondo */}
            <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted" />
            {/* Círculo de progreso */}
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeDasharray={`${(percentage / 100) * 565.48} 565.48`}
              strokeLinecap="round"
              className={`text-primary transition-all duration-500 transform -rotate-90 origin-center`}
              style={{ transform: "rotate(-90deg)" }}
            />
          </svg>

          {/* Texto central */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-4xl font-bold text-primary">{consumed}</div>
            <div className="text-sm text-muted-foreground">/ {dailyGoal} kcal</div>
          </div>
        </div>
      </div>

  {/* Estadísticas */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card p-4 rounded-lg border border-border text-center">
          <div className="text-2xl font-bold text-primary">{consumed}</div>
          <div className="text-xs text-muted-foreground mt-1">Consumidas</div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border text-center">
          <div className={`text-2xl font-bold ${isOverGoal ? "text-destructive" : "text-success"}`}>
            {Math.abs(remaining)}
          </div>
          <div className="text-xs text-muted-foreground mt-1">{isOverGoal ? "Excedidas" : "Restantes"}</div>
        </div>
      </div>

  {/* Mensaje motivacional */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-lg border border-primary/20">
        <p className="text-center text-lg font-medium text-foreground">{message}</p>
      </div>
    </div>
  )
}
