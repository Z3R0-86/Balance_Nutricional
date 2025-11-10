"use client"

import type React from "react"
import { useState } from "react"
import type { User } from "@/lib/types"
import { calculateTDEE } from "@/lib/calorie-calculator"
import { saveUser, getUserByName, userNameExists } from "@/lib/storage"

interface RegistrationFormProps {
  onComplete: (user: User) => void
}

export function RegistrationForm({ onComplete }: RegistrationFormProps) {
  const [mode, setMode] = useState<"login" | "register">("login")
  const [loginName, setLoginName] = useState("")
  const [loginError, setLoginError] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    weight: "",
    height: "",
    sex: "male" as "male" | "female",
    activityLevel: "moderate" as "sedentary" | "light" | "moderate" | "intense",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")

    if (!loginName.trim()) {
      setLoginError("Por favor, ingresa tu nombre")
      return
    }

    const existingUser = getUserByName(loginName)

    if (existingUser) {
      onComplete(existingUser)
    } else {
      setLoginError("Usuario no encontrado. Verifica el nombre o regístrate.")
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = "El nombre es requerido"
    else if (userNameExists(formData.name)) newErrors.name = "Este nombre ya existe. Elige otro."

    const age = Number.parseInt(formData.age)
    if (!formData.age || age < 10 || age > 120) newErrors.age = "Edad válida requerida (10-120)"

    const weight = Number.parseInt(formData.weight)
    if (!formData.weight || weight < 20 || weight > 300) newErrors.weight = "Peso válido requerido (20-300 kg)"

    const height = Number.parseInt(formData.height)
    if (!formData.height || height < 100 || height > 250) newErrors.height = "Altura válida requerida (100-250 cm)"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    const dailyCalorieGoal = calculateTDEE({
      age: Number.parseInt(formData.age),
      weight: Number.parseInt(formData.weight),
      height: Number.parseInt(formData.height),
      sex: formData.sex,
      activityLevel: formData.activityLevel,
    })

    const user: User = {
      id: Date.now().toString(),
      name: formData.name,
      age: Number.parseInt(formData.age),
      weight: Number.parseInt(formData.weight),
      height: Number.parseInt(formData.height),
      sex: formData.sex,
      activityLevel: formData.activityLevel,
      dailyCalorieGoal,
      createdAt: new Date().toISOString(),
    }

    saveUser(user)
    onComplete(user)
  }

  return (
    <div className="w-full max-w-md">
  {/* Selector de modo */}
      <div className="flex gap-2 mb-8 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
        <button
          onClick={() => {
            setMode("login")
            setLoginError("")
            setErrors({})
          }}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
            mode === "login"
              ? "bg-emerald-500 text-white shadow-md"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
          }`}
        >
          Ingresar
        </button>
        <button
          onClick={() => {
            setMode("register")
            setLoginError("")
            setErrors({})
          }}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
            mode === "register"
              ? "bg-emerald-500 text-white shadow-md"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
          }`}
        >
          Registrarse
        </button>
      </div>

  {/* Formulario de inicio de sesión */}
      {mode === "login" && (
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Tu Nombre</label>
            <input
              type="text"
              value={loginName}
              onChange={(e) => setLoginName(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
              placeholder="Ingresa tu nombre"
            />
            {loginError && <p className="text-red-600 dark:text-red-400 text-sm mt-2">{loginError}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors shadow-sm"
          >
            Ingresar
          </button>

          <p className="text-xs text-slate-600 dark:text-slate-400 text-center">
            Tu nombre es tu contraseña. Tus datos están seguros localmente.
          </p>
        </form>
      )}

  {/* Formulario de registro */}
      {mode === "register" && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Nombre</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500"
              placeholder="Tu nombre completo"
            />
            {errors.name && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Edad y sexo */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Edad</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                placeholder="Años"
              />
              {errors.age && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.age}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Sexo</label>
              <select
                value={formData.sex}
                onChange={(e) => setFormData({ ...formData, sex: e.target.value as "male" | "female" })}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="male">Masculino</option>
                <option value="female">Femenino</option>
              </select>
            </div>
          </div>

          {/* Peso y altura */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Peso (kg)</label>
              <input
                type="number"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                placeholder="kg"
              />
              {errors.weight && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.weight}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Altura (cm)</label>
              <input
                type="number"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                placeholder="cm"
              />
              {errors.height && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.height}</p>}
            </div>
          </div>

          {/* Nivel de actividad */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Nivel de Actividad
            </label>
            <select
              value={formData.activityLevel}
              onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value as any })}
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="sedentary">Sedentario (poco ejercicio)</option>
              <option value="light">Ligero (1-3 días/semana)</option>
              <option value="moderate">Moderado (3-5 días/semana)</option>
              <option value="intense">Intenso (6-7 días/semana)</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors shadow-sm"
          >
            Calcular Meta Calórica
          </button>
        </form>
      )}
    </div>
  )
}
