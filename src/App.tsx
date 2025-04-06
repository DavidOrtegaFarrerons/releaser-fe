import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import {ReleaseTable} from "./component/ReleaseTable.tsx";

export default function App() {
  return <MantineProvider theme={theme}><ReleaseTable></ReleaseTable></MantineProvider>;
}
