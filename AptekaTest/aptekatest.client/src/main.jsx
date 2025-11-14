import React from 'react'
import ReactDOM from 'react-dom/client'

// 1. Importujemy BrowserRouter (absolutnie kluczowe dla routingu)
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'

// 2. Importujemy nasz NOWY, główny plik stylów
// To on nadaje ten ładny, niebieski wygląd całej aplikacji
import './styles/Dashboard.css'
// (Jeśli masz też 'globals.css' lub 'index.css', możesz je tu zostawić lub usunąć)

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        {/* 3. <BrowserRouter> MUSI otaczać <App />. 
           To jest to, co naprawi Twój błąd 'useRoutes()'. */}
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>,
)