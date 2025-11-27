import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { CalculatedData, SelectedHybridData } from "@/App"
import MitsuiLogo from "@/assets/mitsui_logo.svg"
import { ArrowLeft } from "lucide-react"

// Icons
import AhorroIcon from "@/assets/icons/ahorro.svg"
import MantenimientoIcon from "@/assets/icons/mantenimiento.svg"
import RuidoIcon from "@/assets/icons/ruido.svg"
import PotenciaIcon from "@/assets/icons/potencia.svg"
import EcologicoIcon from "@/assets/icons/ecologico.svg"
import TecnologiaIcon from "@/assets/icons/tecnologia.svg"

interface StepThreeProps {
  calculatedData: CalculatedData
  selectedHybrid: SelectedHybridData
  onReset: () => void
  onBack: () => void
}

const benefits = [
  {
    icon: AhorroIcon,
    title: "Ahorro continuo",
    description: "Consumo hasta un 40% menor de combustible.",
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

function StepThree({ calculatedData, selectedHybrid, onReset, onBack }: StepThreeProps) {
  // Formateador de moneda
  const formatCurrency = (value: number) => {
    return value.toLocaleString("es-PE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  // Formateador de números grandes sin decimales
  const formatInteger = (value: number) => {
    return value.toLocaleString("es-PE", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
  }

  // Extraer datos del híbrido seleccionado
  const brandName = selectedHybrid.models.brands.name
  const modelName = selectedHybrid.models.name
  const variantName = selectedHybrid.specific_version

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <header className="bg-[#1e3a52] text-white py-6 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            {/* Botón Back */}
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm">Volver</span>
            </button>

            {/* Logo centrado */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <img src={MitsuiLogo} alt="Mitsui Logo" className="h-8 w-auto" />
            </div>

            {/* Espacio para equilibrar el diseño */}
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-10">
        <div className="max-w-5xl mx-auto">
          {/* Savings Header */}
          <div className="text-center mb-10">
            <p className="text-sm tracking-wide text-gray-500 mb-3">Tu comparación con el Toyota</p>
            <h1 className="text-3xl md:text-4xl font-bold text-[#1e3a52] mb-2">
              {brandName} {modelName}
            </h1>
            <p className="text-base md:text-lg text-gray-600 font-medium">{variantName}</p>

            <div className="mt-8 inline-flex flex-col items-center">
              <span className="text-xs uppercase tracking-widest text-gray-400 mb-2">Ahorro anual estimado</span>
              <div className="flex items-baseline gap-1 bg-green-100 border border-green-400 px-6 py-3 rounded-xl">
                <span className="text-sm text-green-700 font-medium">S/</span>
                <span className="text-3xl md:text-4xl font-bold text-green-600">
                  {formatCurrency(selectedHybrid.annualSavings)}
                </span>
                <span className="text-sm text-green-600 font-medium ml-1">/año</span>
              </div>
            </div>
          </div>

          {/* Comparison Table */}
          <Card className="p-8 mb-10 shadow-lg border-2">
            <h2 className="text-xl font-bold text-center text-gray-800 mb-8">Comparativa de gastos y recorrido</h2>

            {/* Grid con items-stretch para altura uniforme */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
              {/* Current Vehicle (Gasolina) */}
              <div className="flex flex-col">
                <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-gray-300">
                  <div className="w-4 h-4 rounded-full bg-gray-600 shrink-0"></div>
                  <span className="font-bold text-lg text-gray-800">{calculatedData.currentCarName}</span>
                  <span className="text-sm bg-gray-100 px-2 py-1 rounded text-gray-700 whitespace-nowrap">Gasolina</span>
                </div>

                {/* Grid con filas iguales */}
                <div className="flex-1 grid grid-rows-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg flex flex-col justify-center min-h-[100px]">
                    <p className="text-sm text-gray-600 mb-1">Gasto mensual estimado</p>
                    <p className="text-2xl font-bold text-gray-800">S/ {formatCurrency(calculatedData.monthlyExpense)}</p>
                    <p className="text-xs text-transparent select-none mt-1" aria-hidden="true">
                      Placeholder
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg flex flex-col justify-center min-h-[100px]">
                    <p className="text-sm text-gray-600 mb-1">Recorrido mensual</p>
                    <p className="text-2xl font-bold text-gray-800">{formatCurrency(calculatedData.monthlyDistance)} km</p>
                  </div>
                </div>
              </div>

              {/* Hybrid Vehicle */}
              <div className="flex flex-col">
                <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-[#00bcd4]">
                  <div className="w-4 h-4 rounded-full bg-[#00bcd4] shrink-0"></div>
                  <span className="font-bold text-lg text-[#00bcd4]">{modelName}</span>
                  <span className="text-sm bg-[#00bcd4]/10 px-2 py-1 rounded text-[#00bcd4] font-semibold whitespace-nowrap">
                    Híbrido
                  </span>
                </div>

                <div className="flex-1 grid grid-rows-2 gap-4">
                  <div className="bg-[#00bcd4]/5 p-4 rounded-lg border-2 border-[#00bcd4]/20 flex flex-col justify-center min-h-[100px]">
                    <p className="text-sm text-gray-600 mb-1">Gasto mensual estimado</p>
                    <p className="text-2xl font-bold text-[#00bcd4]">S/ {formatCurrency(selectedHybrid.monthlySpending)}</p>
                    <p className="text-xs text-green-700 font-semibold mt-1">
                      Ahorras S/ {formatCurrency(selectedHybrid.savings)} al mes
                    </p>
                  </div>

                  <div className="bg-[#00bcd4]/5 p-4 rounded-lg border-2 border-[#00bcd4]/20 flex flex-col justify-center min-h-[100px]">
                    <p className="text-sm text-gray-600 mb-1">Recorrido con el mismo gasto</p>
                    <p className="text-2xl font-bold text-[#00bcd4]">{formatCurrency(selectedHybrid.distance)} km</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="mb-8">
            <h2 className="text-xl font-bold text-center text-toyota-dark mb-8">¿Por qué elegir un Toyota híbrido?</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {benefits.map((benefit, index) => (
                <Card
                  key={index}
                  className="group relative p-6 text-center overflow-hidden border-2 border-transparent hover:border-[#00bcd4]/30 hover:shadow-lg transition-all duration-300 bg-gradient-to-b from-white to-gray-50/50"
                >
                  {/* Decorative background element */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500" />

                  {/* Icon container with background */}
                  <div className="relative mb-4 inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/20 group-hover:to-primary/10 transition-colors duration-300">
                    <img src={benefit.icon} className="h-12 w-12 text-[#00bcd4]" />
                  </div>

                  <h3 className="font-bold text-sm mb-2 text-toyota-dark leading-tight">{benefit.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{benefit.description}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <Card className="p-8 bg-gradient-to-r from-gray-50 to-gray-100 border-2 mb-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left flex-1">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  ¿Te gustaría conocer más sobre este modelo?
                </h3>
                <p className="text-gray-600">
                  Escanea el código QR o solicita que te contacten para una demostración.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-white p-4 rounded-xl shadow-md">
                  <img
                    src="/qr-code-toyota-hybrid.jpg"
                    alt="Código QR"
                    className="w-28 h-28"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <Button
              onClick={onBack}
              variant="outline"
              className="h-14 px-8 text-base font-semibold border-2 border-gray-300 hover:border-gray-400 rounded-full"
            >
              Atrás
            </Button>
            <Button
              onClick={onReset}
              className="h-14 px-12 bg-[#00bcd4] hover:bg-[#00a3b8] text-white text-lg font-bold rounded-full shadow-lg transition-all"
            >
              Nueva comparación
            </Button>
          </div>
        </div>
      </main>

      {/* Footer Disclaimer */}
      <footer className="py-6 px-4 bg-white border-t border-gray-200">
        <p className="text-xs text-gray-600 text-center max-w-3xl mx-auto leading-relaxed">
          * Las cifras presentadas son referenciales y pueden variar según condiciones de conducción y
          mantenimiento. El uso de modelos de otras marcas se realiza únicamente con fines comparativos.
          Toyota Perú no asume responsabilidad por diferencias en el consumo o rendimiento real.
        </p>
      </footer>
    </div>
  )
}

export default StepThree