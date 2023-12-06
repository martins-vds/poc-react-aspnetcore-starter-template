import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

interface Forecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}

interface WeatherForecastTableProps {
  forecasts: Forecast[] | undefined;
}

export const WeatherForecastTable = ({ forecasts }: WeatherForecastTableProps) => {
  return (
    <div>
      <TableContainer className="table table-striped" aria-labelledby="tabelLabel">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell component="th">Date</TableCell>
              <TableCell component="th">Temp. (C)</TableCell>
              <TableCell component="th">Temp. (F)</TableCell>
              <TableCell component="th">Summary</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {forecasts && forecasts.map((forecast) => (
              <TableRow key={forecast.date}>
                <TableCell component="td">{forecast.date}</TableCell>
                <TableCell component="td">{forecast.temperatureC}</TableCell>
                <TableCell component="td">{forecast.temperatureF}</TableCell>
                <TableCell component="td">{forecast.summary}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
