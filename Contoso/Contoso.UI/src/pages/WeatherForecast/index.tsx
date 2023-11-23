import { MsalAuthenticationTemplate } from "@azure/msal-react";
import { loginRequest, protectedResources } from "../../authConfig";
import { InteractionType } from "@azure/msal-browser";
import useFetchWithMsal from "../../hooks/useFetchWithMsal";
import { useEffect, useState } from "react";
import { WeatherForecastTable } from "../../components/WeatherForecastTable";

const WeatherForecastContent = () => {
  const { error, execute } = useFetchWithMsal({
    scopes: protectedResources.apiWeatherForecast.scopes.access_as_user,
  });

  const [forecastData, setForecastData] = useState([]);

  useEffect(() => {
    if (!forecastData) {
      execute("GET", protectedResources.apiWeatherForecast.endpoint).then(
        (response) => {
          setForecastData(response);
        }
      );
    }
  }, [execute, forecastData]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      {forecastData ? <WeatherForecastTable forecasts={forecastData} /> : null}
    </>
  );
};

export const WeatherForecast = () => {
  const authRequest = {
    ...loginRequest,
  };

  return (
    <MsalAuthenticationTemplate
      interactionType={InteractionType.Redirect}
      authenticationRequest={authRequest}
    >
      <WeatherForecastContent />
    </MsalAuthenticationTemplate>
  );
};
