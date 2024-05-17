import "./App.css";
import { ThemeProvider } from "./components/ui/theme-provider";
import Interview from "./pages/Interview";
const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      {<Interview />}
    </ThemeProvider>
  );
};

export default App;
