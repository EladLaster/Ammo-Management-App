import { useEffect, useState } from "react";

const API_KEY = "878eda5e728e1a772a9ec284353e36e2";
const DEFAULT_CITY = "Israel";

export default function UnitWeather({ city }) {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchWeather() {
      setError(null);
      let cityToSearch = city || DEFAULT_CITY;
      let url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        cityToSearch
      )}&appid=${API_KEY}&units=metric&lang=he`;
      let res = await fetch(url);
      let data = await res.json();
      if (data.cod === 200) {
        setWeather(data);
      } else if (cityToSearch !== DEFAULT_CITY) {
        // נסה שוב עם ברירת מחדל (ישראל)
        url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          DEFAULT_CITY
        )}&appid=${API_KEY}&units=metric&lang=he`;
        res = await fetch(url);
        data = await res.json();
        if (data.cod === 200) {
          setWeather(data);
        } else {
          setError("לא ניתן לקבל נתוני מזג אוויר");
        }
      } else {
        setError("לא ניתן לקבל נתוני מזג אוויר");
      }
    }
    fetchWeather();
  }, [city]);

  if (error)
    return <div style={{ color: "red", textAlign: "right" }}>{error}</div>;
  if (!weather)
    return <div style={{ textAlign: "right" }}>טוען מזג אוויר...</div>;

  return (
    <div
      style={{
        textAlign: "right",
        marginBottom: 16,
        background: "#f8f8f8",
        borderRadius: 8,
        padding: 12,
        maxWidth: 350,
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 18 }}>
        מזג האוויר ב{weather.name}
      </div>
      <div style={{ fontSize: 16 }}>
        {weather.weather[0].description} | {Math.round(weather.main.temp)}°C
        <span style={{ marginRight: 8 }}>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
            alt="icon"
            style={{ verticalAlign: "middle" }}
          />
        </span>
      </div>
      <div style={{ fontSize: 14, color: "#888" }}>
        לחות: {weather.main.humidity}% | רוח: {Math.round(weather.wind.speed)}{" "}
        קמ"ש
      </div>
    </div>
  );
}
