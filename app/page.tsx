"use client"

import { useState, useEffect } from "react"
import type { User, DailyRecord } from "@/lib/types"
import { ThemeProvider } from "@/components/theme-provider"
import { RegistrationForm } from "@/components/registration-form"
import { CalorieGoalDisplay } from "@/components/calorie-goal-display"
import { FoodSelector } from "@/components/food-selector"
import { DailyEntries } from "@/components/daily-entries"
import { HistoryChart } from "@/components/history-chart"
import { getUser, clearUser, getDailyRecord, saveDailyRecord, getLastNRecords } from "@/lib/storage"
import { getMotivationalMessage } from "@/lib/calorie-calculator"
import type { FoodItem, DailyFoodEntry } from "@/lib/types"
import { ExportSummary } from "@/components/export-summary"

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [currentRecord, setCurrentRecord] = useState<DailyRecord | null>(null)
  const [historyRecords, setHistoryRecords] = useState<DailyRecord[]>([])
  const [activeTab, setActiveTab] = useState<"today" | "history">("today")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedUser = getUser()
    if (savedUser) {
      setUser(savedUser)
      loadTodaysRecord(savedUser)
      loadHistory(savedUser.id)
    }
  }, [])

  const loadTodaysRecord = (userData: User) => {
    const today = new Date().toISOString().split("T")[0]
    const record = getDailyRecord(today, userData.id)

    if (record) {
      setCurrentRecord(record)
    } else {
      setCurrentRecord({
        date: today,
        entries: [],
        totalCalories: 0,
        dailyGoal: userData.dailyCalorieGoal,
      })
    }
  }

  const loadHistory = (userId: string) => {
    const records = getLastNRecords(7, userId)
    setHistoryRecords(records)
  }

  const handleRegistrationComplete = (newUser: User) => {
    setUser(newUser)
    loadTodaysRecord(newUser)
    loadHistory(newUser.id)
  }

  const handleAddFood = (food: FoodItem, quantity: number) => {
    if (!user || !currentRecord) return

    const calories = Math.round((quantity / 100) * food.caloriesPer100g)
    const newEntry: DailyFoodEntry = {
      id: `${Date.now()}-${Math.random()}`,
      foodId: food.id,
      foodName: food.name,
      quantity,
      calories,
      date: currentRecord.date,
    }

    const updatedEntries = [...currentRecord.entries, newEntry]
    const totalCalories = updatedEntries.reduce((sum, entry) => sum + entry.calories, 0)

    const updatedRecord: DailyRecord = {
      ...currentRecord,
      entries: updatedEntries,
      totalCalories,
    }

    setCurrentRecord(updatedRecord)
    saveDailyRecord(updatedRecord, user.id)
    loadHistory(user.id)
  }

  const handleRemoveFood = (id: string) => {
    if (!currentRecord || !user) return

    const updatedEntries = currentRecord.entries.filter((entry) => entry.id !== id)
    const totalCalories = updatedEntries.reduce((sum, entry) => sum + entry.calories, 0)

    const updatedRecord: DailyRecord = {
      ...currentRecord,
      entries: updatedEntries,
      totalCalories,
    }

    setCurrentRecord(updatedRecord)
    saveDailyRecord(updatedRecord, user.id)
    loadHistory(user.id)
  }

  const handleLogout = () => {
    clearUser()
    setUser(null)
    setCurrentRecord(null)
    setHistoryRecords([])
  }

  if (!mounted) return null

  if (!user) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-950 dark:to-slate-900 flex flex-col items-center justify-center p-4">
          <div className="text-center mb-8">
            <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900">
              <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-300" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M10.5 1.5H5.75A2.25 2.25 0 003.5 3.75v12.5A2.25 2.25 0 005.75 18.5h8.5a2.25 2.25 0 002.25-2.25V8.5m-7-5v5m0 0h5m-5 0L16 3.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                />
              </svg>
            </div>
          <h1 className="text-4xl font-bold mb-2 text-slate-900 dark:text-white">Balance Nutricional</h1>
            <p className="text-slate-600 dark:text-slate-300 text-lg">Controla tu consumo diario de calorías</p>
          </div>
          <RegistrationForm onComplete={handleRegistrationComplete} />
        </div>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
  {/* Encabezado */}
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-emerald-600 dark:text-emerald-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M10.5 1.5H5.75A2.25 2.25 0 003.5 3.75v12.5A2.25 2.25 0 005.75 18.5h8.5a2.25 2.25 0 002.25-2.25V8.5m-7-5v5m0 0h5m-5 0L16 3.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      fill="none"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Balance Nutricional</h1>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Hola, {user.name}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </header>

  {/* Pestañas de navegación */}
        <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex gap-1">
              <button
                onClick={() => setActiveTab("today")}
                className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                  activeTab === "today"
                    ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                    : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                Hoy
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                  activeTab === "history"
                    ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                    : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                Historial (7 días)
              </button>
            </div>
          </div>
        </nav>

  {/* Contenido principal */}
        <main className="max-w-6xl mx-auto px-4 py-8">
          {/* Pestaña Hoy */}
          {activeTab === "today" && currentRecord && (
            <div className="space-y-8">
              {/* Visualizador de objetivo de calorías */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                <CalorieGoalDisplay
                  dailyGoal={currentRecord.dailyGoal}
                  consumed={currentRecord.totalCalories}
                  message={getMotivationalMessage(currentRecord.totalCalories, currentRecord.dailyGoal)}
                />

                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Compartir tu resumen:</p>
                  <ExportSummary record={currentRecord} user={user} />
                </div>
              </div>

              {/* Grid de dos columnas */}
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Selector de alimentos - Ancho completo en móvil */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                  <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Agregar Alimento</h2>
                  <FoodSelector onAddFood={handleAddFood} />
                </div>

                {/* Entradas diarias - Ancho completo en móvil */}
                <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                  <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Registros Hoy</h2>
                  <DailyEntries entries={currentRecord.entries} onRemove={handleRemoveFood} />
                </div>
              </div>
            </div>
          )}

          {/* Pestaña Historial */}
          {activeTab === "history" && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">Historial de Calorías</h2>
              <HistoryChart records={historyRecords} />
            </div>
          )}
        </main>
      </div>
    </ThemeProvider>
  )
}
