"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
// Importamos solo lo necesario desde el orquestador
import type { CalculatedData } from "@/App"
import MitsuiLogo from "@/assets/mitsui_logo.svg"
// Icons
import AhorroIcon from "@/assets/icons/ahorro.svg";
import MantenimientoIcon from "@/assets/icons/mantenimiento.svg";
import RuidoIcon from "@/assets/icons/ruido.svg";
import PotenciaIcon from "@/assets/icons/potencia.svg";
import EcologicoIcon from "@/assets/icons/ecologico.svg";
import TecnologiaIcon from "@/assets/icons/tecnologia.svg";
// Importaremos el tipo HybridComparison para un mejor tipado si fuera necesario,
// pero aquí nos enfocaremos en usar el CalculatedData que viene del App.tsx

interface StepThreeProps {
  // Ya no necesitamos formData, ya que todos los datos clave (gasto) están en calculatedData
  // Lo dejamos solo para acceder al monthlyExpense directamente si es necesario.
  calculatedData: CalculatedData
  selectedHybridId: string
  onReset: () => void
}

// ... (Los beneficios se mantienen igual) ...
const benefits = [
  {
    // Usamos el componente SVG importado
    icon: AhorroIcon,
    title: "Ahorro continuo",
    description: "Consumo hasta un 40 % menor de combustible.",
  },
  {
    icon: MantenimientoIcon,
    title: "Menor mantenimiento",
    description: "Menos desgaste, menos visitas al taller.",
  },
  {
    icon: RuidoIcon,
    title: "Conducción silenciosa y suave",
    description: "Sin vibraciones, ideal para ciudad.",
  },
  {
    icon: PotenciaIcon,
    title: "Mayor potencia al arranque",
    description: "Torque instantáneo para respuesta rápida.",
  },
  {
    icon: EcologicoIcon,
    title: "Compromiso ambiental",
    description: "Menores emisiones y más eficiencia.",
  },
  {
    icon: TecnologiaIcon,
    title: "Tecnología comprobada",
    description: "Más de 25 años de liderazgo híbrido Toyota.",
  },
]


function StepThree({ calculatedData, selectedHybridId, onReset }: StepThreeProps) {
  // 🔑 CLAVE: Encontrar el híbrido seleccionado usando el ID
  const selectedHybrid = calculatedData.hybridComparisons.find(
    (h) => h.id.toString() === selectedHybridId
  )

  if (!selectedHybrid) return null

  // 🔑 CLAVE: Usar el ahorro mensual ya calculado en App.tsx
  const monthlySavings = selectedHybrid.savings;
  // Cálculo: Ahorro Anual (Soles) = Ahorro Mensual * 12
  const annualSavings = Math.max(0, monthlySavings * 12); // [cite: 46]

  // Cálculo: Gasto Mensual del Híbrido = Gasto Inicial - Ahorro Mensual
  // Usamos el gasto inicial del auto del usuario (monthlyExpense) para el cálculo del híbrido.
  // Aunque formData no se pasa, asumiremos que el gasto inicial se puede acceder desde calculatedData
  // Nota: Necesitamos que calculatedData.monthlyExpense sea el gasto inicial del usuario.
  // Vamos a buscar el gasto inicial del usuario de una manera robusta:
  const initialMonthlyExpense = calculatedData.monthlyDistance / calculatedData.currentFuelEfficiency * calculatedData.config.fuelPricePerLiter;
  // Esto es técnicamente lo que el usuario ingresó, pero recalculado.
  // Para simplificar y mantener la consistencia con el flujo:
  // **Suposición:** Necesitas el valor original ingresado por el usuario. **DEBEMOS corregir `App.tsx` para incluir este valor.** // --- Solución Temporal y Adaptación ---
  // Usaremos el gasto inicial del usuario que el App.tsx debe haber usado:
  // El gasto inicial es el dinero que gastó para recorrer 'monthlyDistance' en su coche.
  const currentMonthlyExpense = initialMonthlyExpense;

  // Gasto Mensual Estimado del Híbrido (para recorrer la misma distancia)
  const hybridMonthlyExpense = currentMonthlyExpense - monthlySavings; // [cite: 38]


  // 🔑 ADAPTACIÓN DE NOMBRES DE LA DB (Deep Join)
  const brandName = selectedHybrid.models.brands.name;
  const modelName = selectedHybrid.models.name;
  const variantName = selectedHybrid.specific_version;
  // Nombre del coche del usuario que ya se corrigió en StepTwo
  const currentCarName = calculatedData.currentCarName;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-[#1e3a52] text-white py-6 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center">
            <img src={MitsuiLogo} alt="Mitsui Logo" className="h-8 w-auto" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Savings Header */}
          <div className="text-center mb-8">
            <p className="text-muted-foreground mb-1">Tu comparación con el Toyota</p>
            <h1 className="text-xl md:text-2xl font-bold text-toyota-dark mb-4">
              {brandName} {modelName} {variantName}
            </h1>
            <p className="text-sm text-muted-foreground mb-2">PUEDES AHORRAR HASTA [cite: 46]</p>
            <p className="text-4xl md:text-5xl font-bold text-primary">
              S/{" "}
              {annualSavings.toLocaleString("es-PE", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </p>
            <p className="text-muted-foreground">al año</p>
          </div>

          {/* Comparison Table */}
          <Card className="p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Current Vehicle (Gasolina) */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-muted-foreground"></div>
                  <span className="font-semibold text-toyota-dark">{currentCarName} (gasolina) [cite: 36]</span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground">Gasto mensual estimado [cite: 39]</span>
                    <span className="font-semibold">S/ {currentMonthlyExpense.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} [cite: 37]</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-muted-foreground">Recorrido [cite: 44]</span>
                    <span className="font-semibold">
                      {calculatedData.monthlyDistance.toLocaleString("es-PE", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      km [cite: 42]
                    </span>
                  </div>
                </div>
              </div>

              {/* Hybrid Vehicle */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span className="font-semibold text-primary">{modelName} (híbrido) [cite: 41]</span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground">Gasto mensual estimado [cite: 39]</span>
                    <span className="font-semibold text-primary">
                      S/{" "}
                      {hybridMonthlyExpense.toLocaleString("es-PE", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      por mes [cite: 38]
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-muted-foreground">Recorrido [cite: 44]</span>
                    <span className="font-semibold text-primary">
                      {selectedHybrid.distance.toLocaleString("es-PE", {
                        minimumFractionDigits: 1,
                        maximumFractionDigits: 1,
                      })}{" "}
                      km [cite: 43]
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Benefits Section (Se mantiene igual) [cite: 47] */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-center text-toyota-dark mb-6">¿Por qué elegir un Toyota híbrido?</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {benefits.map((benefit, index) => (
                <Card key={index} className="p-4 text-center hover:shadow-md transition-shadow">
                  {/* 🔑 CAMBIO CLAVE: Renderizamos el componente SVG */}
                  <benefit.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold text-sm mb-1 text-toyota-dark">{benefit.title}</h3>
                  <p className="text-xs text-muted-foreground">{benefit.description}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA Section (Se mantiene igual) [cite: 64] */}
          <Card className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-0">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <p className="text-muted-foreground mb-2">¿Te gustaría conocer más sobre este modelo? [cite: 64]</p>
                <p className="text-sm text-muted-foreground">
                  Escanea el código QR o solicita que te contacten para una demostración. [cite: 64]
                </p>
              </div>
              <div className="flex items-center gap-4">
                <img src="/qr-code-toyota-hybrid.jpg" alt="Código QR" className="w-24 h-24 bg-white p-2 rounded-lg" />
              </div>
            </div>
          </Card>

          {/* Reset Button [cite: 65] */}
          <div className="text-center mt-8">
            <Button
              onClick={onReset}
              variant="outline"
              className="h-12 px-8 border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
            >
              Reiniciar [cite: 65]
            </Button>
          </div>
        </div>
      </main>

      {/* Footer Disclaimer [cite: 66, 67, 68] */}
      <footer className="py-4 px-4 text-center">
        <p className="text-xs text-muted-foreground max-w-2xl mx-auto">
          * Las cifras presentadas son referenciales y pueden variar según condiciones de conducción y mantenimiento. [cite: 66] El uso de modelos de otras marcas se realiza únicamente con fines comparativos. [cite: 67] Toyota Perú no asume responsabilidad por diferencias en el consumo o rendimiento real. [cite: 68]
        </p>
      </footer>
    </div>
  )
}

export default StepThree