import UnitWeather from "./UnitWeather";
import { observer } from "mobx-react-lite";
import { requestStore } from "../RequestStore";

const UnitWeatherContainer = observer(() => {
  let city = null;
  for (const req of requestStore.requests) {
    if (
      req.unitLocation &&
      typeof req.unitLocation === "string" &&
      req.unitLocation.trim().length > 1
    ) {
      city = req.unitLocation.trim();
      break;
    }
    if (
      req.unitNumber &&
      typeof req.unitNumber === "string" &&
      req.unitNumber.trim().length > 1
    ) {
      city = req.unitNumber.trim();
      break;
    }
  }
  return <UnitWeather city={city} />;
});

export default UnitWeatherContainer;
