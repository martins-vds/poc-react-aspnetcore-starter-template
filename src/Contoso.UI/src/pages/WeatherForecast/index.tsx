import useFetchWithMsal, { HttpMethod } from "../../hooks/useFetchWithMsal";
import { useEffect } from "react";
import { WeatherForecastTable } from "../../components/WeatherForecastTable";
import { protectedResources } from "../../authConfig";

export const WeatherForecast = () => {

  const { error, execute, data, isLoading } = useFetchWithMsal();

  useEffect(() => {
    execute(HttpMethod.Get, protectedResources.apiWeatherForecast.endpoint, protectedResources.apiWeatherForecast.scopes.access_as_user);
  }, [execute]);

  if (error) {
    return <div>Failed to fetch data. Reason: {error.message}</div>;
  }

  return (
    <>
      {isLoading ? <div>Loading...</div> : <WeatherForecastTable forecasts={data} />}
    </>
  );
};
