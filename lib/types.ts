export interface WeatherForecast {
  date: string
  temp: number
  tempMin: number
  tempMax: number
  humidity: number
  rainfall: number
  condition: "sunny" | "cloudy" | "rainy" | "stormy"
  windSpeed: number
}

export interface WeatherAlert {
  id: string
  type: "warning" | "danger" | "info"
  title: string
  description: string
  region: string
  validUntil: Date
}

export interface CurrentWeather {
  temp: number
  feelsLike: number
  humidity: number
  windSpeed: number
  condition: string
  description: string
  rainfall: number
  pressure: number
}

export interface MarketPrice {
  id: string
  crop: string
  region: string
  market: string
  price: number
  unit: string
  change: number
  lastUpdated: Date
  trend: "up" | "down" | "stable"
}
