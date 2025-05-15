import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "../src/styles/App.css";
import Rutas from "./routes/Rutas";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
             <Rutas/>
        </BrowserRouter>
    </StrictMode>
);
