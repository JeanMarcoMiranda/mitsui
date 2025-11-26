// Datos de marcas y modelos con su consumo de combustible (km/l)
export const carBrands = [
  { id: "toyota", name: "Toyota" },
  { id: "hyundai", name: "Hyundai" },
  { id: "kia", name: "Kia" },
  { id: "nissan", name: "Nissan" },
  { id: "chevrolet", name: "Chevrolet" },
  { id: "volkswagen", name: "Volkswagen" },
  { id: "honda", name: "Honda" },
  { id: "mazda", name: "Mazda" },
  { id: "suzuki", name: "Suzuki" },
  { id: "ford", name: "Ford" },
]

export const carModels: Record<string, { id: string; name: string; fuelEfficiency: number }[]> = {
  toyota: [
    { id: "corolla", name: "Corolla", fuelEfficiency: 14.5 },
    { id: "yaris", name: "Yaris", fuelEfficiency: 15.2 },
    { id: "rav4", name: "RAV4", fuelEfficiency: 12.8 },
    { id: "camry", name: "Camry", fuelEfficiency: 13.5 },
  ],
  hyundai: [
    { id: "accent", name: "Accent", fuelEfficiency: 14.0 },
    { id: "elantra", name: "Elantra", fuelEfficiency: 13.8 },
    { id: "tucson", name: "Tucson", fuelEfficiency: 11.5 },
    { id: "creta", name: "Creta", fuelEfficiency: 12.5 },
  ],
  kia: [
    { id: "rio", name: "Rio", fuelEfficiency: 14.2 },
    { id: "cerato", name: "Cerato", fuelEfficiency: 13.5 },
    { id: "sportage", name: "Sportage", fuelEfficiency: 11.8 },
    { id: "seltos", name: "Seltos", fuelEfficiency: 12.2 },
  ],
  nissan: [
    { id: "sentra", name: "Sentra", fuelEfficiency: 13.2 },
    { id: "versa", name: "Versa", fuelEfficiency: 14.8 },
    { id: "xtrail", name: "X-Trail", fuelEfficiency: 11.2 },
    { id: "kicks", name: "Kicks", fuelEfficiency: 13.0 },
  ],
  chevrolet: [
    { id: "sail", name: "Sail", fuelEfficiency: 13.5 },
    { id: "onix", name: "Onix", fuelEfficiency: 14.0 },
    { id: "tracker", name: "Tracker", fuelEfficiency: 12.0 },
    { id: "captiva", name: "Captiva", fuelEfficiency: 10.5 },
  ],
  volkswagen: [
    { id: "gol", name: "Gol", fuelEfficiency: 13.8 },
    { id: "polo", name: "Polo", fuelEfficiency: 14.5 },
    { id: "tiguan", name: "Tiguan", fuelEfficiency: 11.0 },
    { id: "tcross", name: "T-Cross", fuelEfficiency: 12.5 },
  ],
  honda: [
    { id: "civic", name: "Civic", fuelEfficiency: 14.0 },
    { id: "city", name: "City", fuelEfficiency: 15.0 },
    { id: "crv", name: "CR-V", fuelEfficiency: 11.8 },
    { id: "hrv", name: "HR-V", fuelEfficiency: 12.8 },
  ],
  mazda: [
    { id: "mazda2", name: "Mazda 2", fuelEfficiency: 15.5 },
    { id: "mazda3", name: "Mazda 3", fuelEfficiency: 14.2 },
    { id: "cx30", name: "CX-30", fuelEfficiency: 12.5 },
    { id: "cx5", name: "CX-5", fuelEfficiency: 11.5 },
  ],
  suzuki: [
    { id: "swift", name: "Swift", fuelEfficiency: 16.0 },
    { id: "baleno", name: "Baleno", fuelEfficiency: 15.5 },
    { id: "vitara", name: "Vitara", fuelEfficiency: 13.0 },
    { id: "scross", name: "S-Cross", fuelEfficiency: 12.8 },
  ],
  ford: [
    { id: "fiesta", name: "Fiesta", fuelEfficiency: 13.5 },
    { id: "focus", name: "Focus", fuelEfficiency: 13.0 },
    { id: "escape", name: "Escape", fuelEfficiency: 11.5 },
    { id: "territory", name: "Territory", fuelEfficiency: 11.0 },
  ],
}

// Modelos híbridos Toyota con su eficiencia (km/l)
export const toyotaHybridModels = [
  {
    id: "yaris-cross",
    name: "Toyota Yaris Cross",
    variant: "1.5 HV FULL CVT",
    fuelEfficiency: 23.5,
    image: "/toyota-yaris-cross-hybrid-white-suv.jpg",
  },
  {
    id: "corolla",
    name: "Toyota Corolla",
    variant: "1.8 HEV XEI",
    fuelEfficiency: 22.0,
    image: "/toyota-corolla-hybrid-white-sedan.jpg",
  },
  {
    id: "corolla-cross",
    name: "Toyota Corolla Cross",
    variant: "1.8 Full D-LUX HEV CVT",
    fuelEfficiency: 21.5,
    image: "/toyota-corolla-cross-hybrid-white-suv.jpg",
  },
  {
    id: "rav4",
    name: "Toyota RAV4",
    variant: "2.5 FULL D-LUX 4X2 CVT HEV",
    fuelEfficiency: 20.0,
    image: "/toyota-rav4-hybrid-white-suv.jpg",
  },
]

// Precio promedio de gasolina en Perú (soles por litro)
export const FUEL_PRICE_PER_LITER = 16.5
