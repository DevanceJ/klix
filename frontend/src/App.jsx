import "./App.css";
import { ThemeProvider } from "./components/ui/theme-provider";
// import Interview from "./pages/Interview";
import About from "./pages/About";
import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/code/:roomId" element={<Interview />} /> */}
          <Route path="/about" element={<About />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
