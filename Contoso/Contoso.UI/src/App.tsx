import { Route, Routes } from "react-router-dom";
import "./App.css";
import { Home } from "./pages/Home";
import { MsalProvider } from "@azure/msal-react";
import { IPublicClientApplication } from "@azure/msal-browser";
import { PageLayout } from "./components/PageLayout";

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
      <Route path="/" element={<Home />} />
    </Routes>
  );
}

export default App;
