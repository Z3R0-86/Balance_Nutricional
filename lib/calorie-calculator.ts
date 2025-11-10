export interface CalorieCalculationInput {
  age: number
  weight: number // kg
  height: number // cm
  sex: "male" | "female"
  activityLevel: "sedentary" | "light" | "moderate" | "intense"
}

// Esta es la fórmula simplificada más precisa para el cálculo del BMR
export function calculateBMR(input: CalorieCalculationInput): number {
  const { age, weight, height, sex } = input

  // Ecuación original de Harris-Benedict (1919)
  if (sex === "male") {
  // BMR = 88.362 + (13.397 × weight_kg) + (4.799 × height_cm) - (5.677 × age_years)
    return 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age
  } else {
  // BMR = 447.593 + (9.247 × weight_kg) + (3.098 × height_cm) - (4.33 × age_years)
    return 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age
  }
}

// Multiplicadores de actividad (basados en consenso científico)
const ACTIVITY_MULTIPLIERS: Record<string, number> = {
  sedentary: 1.2, // Poco o ningún ejercicio
  light: 1.375, // Ejercicio 1-3 días por semana
  moderate: 1.55, // Ejercicio 3-5 días por semana
  intense: 1.725, // Ejercicio 6-7 días por semana
}

export function calculateTDEE(input: CalorieCalculationInput): number {
  const bmr = calculateBMR(input)
  const multiplier = ACTIVITY_MULTIPLIERS[input.activityLevel] || 1.2
  return Math.round(bmr * multiplier)
}

export function getMotivationalMessage(consumed: number, goal: number): string {
  const ratio = consumed / goal

  if (ratio === 0) {
    return "¡Comienza tu día! Registra tus primeras calorías."
  } else if (ratio < 0.5) {
    return "¡Buen comienzo! Te falta energía, come algo nutritivo."
  } else if (ratio >= 0.5 && ratio < 0.9) {
    return "¡Vas bien! Estás en el camino correcto."
  } else if (ratio >= 0.9 && ratio <= 1.1) {
    return "¡Excelente! Estás alcanzando tu meta calórica."
  } else if (ratio > 1.1 && ratio < 1.3) {
    return "Te pasaste un poco, pero ¡mañana lo harás mejor!"
  } else {
    return "Superaste tu meta. Ajusta mañana para mejores resultados."
  }
}
