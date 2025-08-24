import { useEffect, useState } from "react";

const API_KEY = "878eda5e728e1a772a9ec284353e36e2";
const DEFAULT_CITY = "Israel";

export default function UnitWeather({ city }) {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    async function fetchWeather() {
      setError(null);
      let cityToSearch = city || DEFAULT_CITY;
      let url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        cityToSearch
      )}&appid=${API_KEY}&units=metric&lang=he`;
      let res = await fetch(url);
      let data = await res.json();
      if (data.cod === 200) setWeather(data);
      else setError("לא ניתן לקבל נתוני מזג אוויר");
    }
    fetchWeather();
  }, [city]);

  if (error) {
    return (
      <div className="modern-card p-md">
        <div className="modern-badge modern-badge-danger">{error}</div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="modern-card p-md">
        <div className="modern-loading">
          <div className="modern-spinner"></div>
          <span className="ml-sm">טוען מזג אוויר...</span>
        </div>
      </div>
    );
  }

  return (
    <div >
      <div
        style={{
          position: "relative",
          display: "inline-block",
        }}
        onMouseEnter={() => setOpened(true)}
        onMouseLeave={() => setOpened(false)}
      >
        <div
          className="modern-btn modern-btn-secondary"
          style={{
            cursor: "pointer",
            background:
              "linear-gradient(135deg, var(--warning-50) 0%, var(--secondary-50) 100%)",
            border: "1px solid var(--warning-300)",
            color: "var(--military-dark)",
            fontWeight: "600",
          }}
        >
          🌤️ מזג אוויר
        </div>

        {opened && (
  <div
    className="modern-card"
    style={{
      position: "absolute",
      top: "100%",
      right: 0,
      zIndex: 1000,
      marginTop: "var(--space-sm)",
      width: "220px",
      boxShadow: "var(--shadow-xl)",
      border: "1px solid var(--warning-300)",
      padding: "0.5rem",
    }}
  >
    <div className="p-xs" style={{ textAlign: "right" }}>
      <div className="modern-nav mb-xs">
        <h4 style={{ margin: 0, fontSize: "0.9rem", color: "var(--military-green)" }}>
          {weather.name}
        </h4>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.8rem" }}>
        <img
          src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
          alt="weather icon"
          width={30}
          height={30}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <span>{weather.weather[0].description}</span>
          <span style={{ fontWeight: 600 }}>{Math.round(weather.main.temp)}°C</span>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px", fontSize: "0.75rem" }}>
        <span>💧 {weather.main.humidity}%</span>
        <span>💨 {Math.round(weather.wind.speed)} קמ"ש</span>
      </div>
    </div>
  </div>
)}

      </div>
    </div>
  );
}
