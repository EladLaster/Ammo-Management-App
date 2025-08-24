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
    <div className="modern-card p-md">
      <div
        className="modern-btn modern-btn-secondary"
        style={{
          position: "relative",
          cursor: "pointer",
          background:
            "linear-gradient(135deg, var(--warning-50) 0%, var(--secondary-50) 100%)",
          border: "1px solid var(--warning-300)",
          color: "var(--military-dark)",
          fontWeight: "600",
        }}
        onMouseEnter={() => setOpened(true)}
        onMouseLeave={() => setOpened(false)}
      >
        🌤️ מזג אוויר
        {opened && (
          <div
            className="modern-card"
            style={{
              position: "absolute",
              top: "100%",
              left: "0",
              right: "0",
              zIndex: 1000,
              marginTop: "var(--space-sm)",
              minWidth: "250px",
              boxShadow: "var(--shadow-xl)",
              border: "1px solid var(--warning-300)",
            }}
            onMouseEnter={() => setOpened(true)}
            onMouseLeave={() => setOpened(false)}
          >
            <div className="p-md">
              <div className="modern-nav mb-sm">
                <h4 style={{ margin: 0, color: "var(--military-green)" }}>
                  {weather.name}
                </h4>
              </div>

              <div className="flex items-center gap-md mb-sm">
                <img
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                  alt="weather icon"
                  width={40}
                  height={40}
                />
                <div>
                  <div className="modern-badge modern-badge-info">
                    {weather.weather[0].description}
                  </div>
                  <div
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: "700",
                      color: "var(--military-green)",
                      marginTop: "var(--space-xs)",
                    }}
                  >
                    {Math.round(weather.main.temp)}°C
                  </div>
                </div>
              </div>

              <div
                className="modern-grid modern-grid-2"
                style={{ fontSize: "0.75rem" }}
              >
                <div className="text-center">
                  <div className="modern-badge modern-badge-info">
                    💧 לחות: {weather.main.humidity}%
                  </div>
                </div>
                <div className="text-center">
                  <div className="modern-badge modern-badge-info">
                    💨 רוח: {Math.round(weather.wind.speed)} קמ"ש
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
