import { Route, Routes } from "react-router-dom";
import "./App.css";
import { Home } from "./pages/Home";
import { MsalAuthenticationTemplate, MsalProvider } from "@azure/msal-react";
import { IPublicClientApplication, InteractionType } from "@azure/msal-browser";
import { PageLayout } from "./components/PageLayout";
import { WeatherForecast } from "./pages/WeatherForecast";

interface AppProps {
  pca: IPublicClientApplication;
}

function App({ pca }: AppProps) {
  return (
    <MsalProvider instance={pca}>
      <PageLayout>
        <Pages />
      </PageLayout>
    </MsalProvider>
  );
}

function Pages() {
  return (
    <Routes>
      <Route path="*" element={
        <MsalAuthenticationTemplate interactionType={InteractionType.Redirect}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/weather-forecast" element={<WeatherForecast />} />
          </Routes>
        </MsalAuthenticationTemplate>
      } />
    </Routes>
  );
}

export default App;
