import { useEffect, useState } from "react";
import { Popover, Button, Text } from "@mantine/core";

const API_KEY = "878eda5e728e1a772a9ec284353e36e2";
const DEFAULT_CITY = "Israel";

export default function UnitWeather({ city }) {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [opened, setOpened] = useState(false); // state לפתיחת הפופובר

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

  if (error) return <Text color="red">{error}</Text>;
  if (!weather) return <Text>טוען מזג אוויר...</Text>;

  return (
    <Popover
      width={250}
      position="bottom"
      withArrow
      shadow="md"
      opened={opened} // שולטים כאן
    >
      <Popover.Target>
        <Button
          variant="outline"
          size="sm"
          onMouseEnter={() => setOpened(true)}
          onMouseLeave={() => setOpened(false)}
          style={{background: "white" , color: "black", marginBottom: "5px"}}
          
        >
          🌤️ מזג אוויר
        </Button>
      </Popover.Target>
      <Popover.Dropdown
        onMouseEnter={() => setOpened(true)}
        onMouseLeave={() => setOpened(false)}
      >
        <Text weight={700} size="md">
          {weather.name}
        </Text>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
            alt="icon"
            width={40}
            height={40}
          />
          <Text size="sm">
            {weather.weather[0].description} | {Math.round(weather.main.temp)}°C
          </Text>
        </div>
        <Text size="xs" color="dimmed">
          לחות: {weather.main.humidity}% | רוח: {Math.round(weather.wind.speed)} קמ"ש
        </Text>
      </Popover.Dropdown>
    </Popover>
  );
}
