import { BrowserRouter, Routes, Route } from "react-router-dom"
import Dashboard from "./pages/Dashboard/Dashboard"

// Ana uygulama bileşeni.
// Router burada tanımlanır ve sayfa yönlendirmeleri yapılır.
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ana sayfa Dashboard'a yönlendirilir */}
        <Route path="/" element={<Dashboard />} />

        {/* Dashboard sayfası için route */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App