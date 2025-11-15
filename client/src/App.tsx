import { Route, Routes } from "react-router"
import Home from "./pages/Home/Home"
import Navbar from "./components/Navbar/Navbar"

function App() {

  return (
    <div className="app">
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
