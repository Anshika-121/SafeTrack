// riskCalculator.js

export const calculateRiskLevel = ({ rain = 0, wind = 0, alerts = [] }) => {
    // Future-proof thresholds
    const thresholds = {
      rain: { moderate: 30, high: 80 },    // in mm
      wind: { moderate: 40, high: 70 },    // in m/s
    };
  
    // If there are official weather alerts, we treat it as HIGH
    if (alerts.length > 0) return 'HIGH';
  
    if (rain >= thresholds.rain.high || wind >= thresholds.wind.high) return 'HIGH';
  
    if (
      (rain >= thresholds.rain.moderate && rain < thresholds.rain.high) ||
      (wind >= thresholds.wind.moderate && wind < thresholds.wind.high)
    )
      return 'MODERATE';
  
    return 'LOW';
  };
  