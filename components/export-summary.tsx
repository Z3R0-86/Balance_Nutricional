"use client"

import { Button } from "@/components/ui/button"
import type { DailyRecord, User } from "@/lib/types"

interface ExportSummaryProps {
  record: DailyRecord
  user: User
}

export function ExportSummary({ record, user }: ExportSummaryProps) {
  const remaining = record.dailyGoal - record.totalCalories
  const isOverGoal = record.totalCalories > record.dailyGoal
  const percentage = Math.min((record.totalCalories / record.dailyGoal) * 100, 100)

  const handleDownloadPDF = () => {
    // Crear contenido HTML para el PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Resumen Diario - Contador de Calorías</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background: white;
              color: #333;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #10b981;
              padding-bottom: 20px;
            }
            .header h1 {
              margin: 0;
              color: #10b981;
              font-size: 28px;
            }
            .header p {
              margin: 10px 0 0 0;
              color: #666;
            }
            .summary-box {
              background: #f0fdf4;
              border: 2px solid #10b981;
              border-radius: 8px;
              padding: 20px;
              margin-bottom: 20px;
              text-align: center;
            }
            .summary-box h2 {
              margin: 0 0 15px 0;
              color: #10b981;
              font-size: 18px;
            }
            .stats-row {
              display: flex;
              justify-content: space-around;
              margin: 15px 0;
            }
            .stat-item {
              text-align: center;
            }
            .stat-value {
              font-size: 24px;
              font-weight: bold;
              color: #10b981;
              margin-bottom: 5px;
            }
            .stat-label {
              font-size: 12px;
              color: #666;
              text-transform: uppercase;
            }
            .entries-section {
              margin-top: 30px;
            }
            .entries-section h3 {
              color: #10b981;
              margin-top: 0;
              border-bottom: 1px solid #e5e7eb;
              padding-bottom: 10px;
            }
            .entry-item {
              display: flex;
              justify-content: space-between;
              padding: 10px 0;
              border-bottom: 1px solid #e5e7eb;
            }
            .entry-name {
              font-weight: 500;
            }
            .entry-cal {
              color: #10b981;
              font-weight: bold;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              font-size: 12px;
              color: #999;
            }
            .progress-bar {
              width: 100%;
              height: 20px;
              background: #e5e7eb;
              border-radius: 10px;
              overflow: hidden;
              margin: 10px 0;
            }
            .progress-fill {
              height: 100%;
              background: #10b981;
              width: ${Math.min(percentage, 100)}%;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Resumen Diario</h1>
            <p>${new Date(record.date).toLocaleDateString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
            <p>Usuario: ${user.name}</p>
          </div>

          <div class="summary-box">
            <h2>Progreso de Calorías</h2>
            <div class="progress-bar">
              <div class="progress-fill"></div>
            </div>
            <div class="stats-row">
              <div class="stat-item">
                <div class="stat-value">${record.totalCalories}</div>
                <div class="stat-label">Consumidas</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">${record.dailyGoal}</div>
                <div class="stat-label">Meta Diaria</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">${Math.abs(remaining)}</div>
                <div class="stat-label">${isOverGoal ? "Excedidas" : "Restantes"}</div>
              </div>
            </div>
          </div>

          ${
            record.entries.length > 0
              ? `
            <div class="entries-section">
              <h3>Alimentos Consumidos</h3>
              ${record.entries
                .map(
                  (entry) => `
                <div class="entry-item">
                  <div>
                    <div class="entry-name">${entry.foodName}</div>
                    <div style="font-size: 12px; color: #999;">${entry.quantity}g</div>
                  </div>
                  <div class="entry-cal">${entry.calories} kcal</div>
                </div>
              `,
                )
                .join("")}
            </div>
          `
              : ""
          }

          <div class="footer">
            <p>Generado con Contador de Calorías</p>
            <p>${new Date().toLocaleString("es-ES")}</p>
          </div>
        </body>
      </html>
    `

    // Crear un blob y descargarlo
    const element = document.createElement("a")
    const file = new Blob([htmlContent], { type: "text/html" })
    element.href = URL.createObjectURL(file)
    element.download = `resumen-calorias-${record.date}.html`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const handleShareSummary = () => {
    const summaryText = `📊 Mi Resumen Diario de Calorías (${new Date(record.date).toLocaleDateString("es-ES")})
    
✅ Consumidas: ${record.totalCalories} kcal
🎯 Meta: ${record.dailyGoal} kcal
${isOverGoal ? `⚠️ Excedidas por: ${Math.abs(remaining)} kcal` : `💪 Te faltan: ${remaining} kcal`}

${record.entries.length > 0 ? `Alimentos: ${record.entries.map((e) => `${e.foodName} (${e.calories} kcal)`).join(", ")}` : ""}

Generado con Contador de Calorías 🍎`

    // Copiar al portapapeles
    navigator.clipboard.writeText(summaryText).then(() => {
      alert("Resumen copiado al portapapeles!")
    })
  }

  return (
    <div className="flex gap-3 flex-wrap">
      <Button onClick={handleDownloadPDF} className="gap-2" size="sm">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Descargar Resumen diario
      </Button>

      <Button onClick={handleShareSummary} variant="outline" className="gap-2 bg-transparent" size="sm">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
        Compartir
      </Button>
    </div>
  )
}
