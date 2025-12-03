import { Route, Routes } from 'react-router'
import Home from './pages/Home/Home'
import Navbar from './components/Navbar/Navbar'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Crear QueryClient fuera del componente para evitar recrearlo en cada render
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: 1
    }
  }
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className='app'>
        <Navbar />
        <div className='container'>
          <Routes>
            <Route
              path='/'
              element={<Home />}
            />
          </Routes>
        </div>
      </div>
    </QueryClientProvider>
  )
}

export default App
