// קומפוננטה זו תשלוף את שם העיר של היחידה מתוך ה-requestStore (אם יש)
// ותעביר אותו ל-UnitWeather
import UnitWeather from "./UnitWeather";
import { observer } from "mobx-react-lite";
import { requestStore } from "./RequestStore";

const UnitWeatherContainer = observer(() => {
  // נניח שליחידה יש שם עיר בשדה location או name
  // ניקח את שם העיר מהבקשה הראשונה של המשתמש (אם יש)
  let city = null;
  if (requestStore.requests.length > 0) {
    // ננסה מהשדה units.location או units.name
    const req = requestStore.requests[0];
    city = req.unitLocation || req.unitNumber || null;
  }
  return <UnitWeather city={city} />;
});

export default UnitWeatherContainer;
