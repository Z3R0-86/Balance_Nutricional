"use client"

import { useState } from "react"
import type { FoodItem } from "@/lib/types"
import { FOOD_DATABASE, getCategoryLabel } from "@/lib/food-database"

interface FoodSelectorProps {
  onAddFood: (food: FoodItem, quantity: number) => void
}

export function FoodSelector({ onAddFood }: FoodSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null)
  const [quantity, setQuantity] = useState("100")

  const categories = ["all", "fruits", "proteins", "dairy", "grains", "vegetables", "beverages", "snacks"]

  const filteredFoods = FOOD_DATABASE.filter((food) => {
    const matchesCategory = selectedCategory === "all" || food.category === selectedCategory
    const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleAddFood = () => {
    if (selectedFood && quantity) {
      onAddFood(selectedFood, Number.parseInt(quantity))
      setSelectedFood(null)
      setQuantity("100")
      setSearchTerm("")
    }
  }

  return (
    <div className="space-y-4">
  {/* Buscar */}
      <div>
        <input
          type="text"
          placeholder="Buscar alimento..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
        />
      </div>

  {/* Filtro de categoría */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === cat
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-border"
            }`}
          >
            {cat === "all" ? "Todos" : getCategoryLabel(cat)}
          </button>
        ))}
      </div>

  {/* Lista de alimentos */}
      <div className="max-h-64 overflow-y-auto space-y-2">
        {filteredFoods.map((food) => (
          <button
            key={food.id}
            onClick={() => setSelectedFood(food)}
            className={`w-full text-left p-3 rounded-lg border transition-colors ${
              selectedFood?.id === food.id ? "bg-primary/10 border-primary" : "bg-card border-border hover:bg-muted"
            }`}
          >
            <div className="flex justify-between">
              <span className="font-medium">{food.name}</span>
              <span className="text-sm text-muted-foreground">{food.caloriesPer100g} kcal/100g</span>
            </div>
          </button>
        ))}
      </div>

  {/* Entrada de cantidad */}
      {selectedFood && (
        <div className="bg-card p-4 rounded-lg border border-border space-y-3">
          <div>
            <p className="font-medium mb-2">{selectedFood.name}</p>
            <p className="text-sm text-muted-foreground">{selectedFood.caloriesPer100g} kcal por 100g</p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              placeholder="Cantidad (g)"
            />
            <span className="text-sm text-muted-foreground">g</span>
          </div>

          <div className="text-sm font-medium text-primary">
            Total: {Math.round((Number.parseInt(quantity) / 100) * selectedFood.caloriesPer100g)} kcal
          </div>

          <button
            onClick={handleAddFood}
            className="w-full py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Agregar Alimento
          </button>
        </div>
      )}
    </div>
  )
}
