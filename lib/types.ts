// Definiciones de tipos para la aplicación de contador de calorías

export interface User {
  id: string
  name: string
  age: number
  weight: number // kg
  height: number // cm
  sex: "male" | "female"
  activityLevel: "sedentary" | "light" | "moderate" | "intense"
  dailyCalorieGoal: number
  createdAt: string
}

export interface FoodItem {
  id: string
  name: string
  caloriesPer100g: number
  category: "fruits" | "proteins" | "dairy" | "grains" | "vegetables" | "beverages" | "snacks"
  servingSize?: string
}

export interface DailyFoodEntry {
  id: string
  foodId: string
  foodName: string
  quantity: number // en gramos
  calories: number
  date: string
}

export interface DailyRecord {
  date: string
  entries: DailyFoodEntry[]
  totalCalories: number
  dailyGoal: number
}
