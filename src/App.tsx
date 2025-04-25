import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import {BrowserRouter, Route, Router, Routes} from "react-router-dom";
import ReleaseTablePage from "./page/ReleaseTablePage.tsx";

export default function App() {
  return <MantineProvider theme={theme}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ReleaseTablePage />} />
        <Route path="/:releaseName" element={<ReleaseTablePage />} />
      </Routes>
    </BrowserRouter>
  </MantineProvider>;
}
