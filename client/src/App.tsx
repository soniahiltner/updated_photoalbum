import { Route, Routes } from 'react-router'
import Home from './pages/Home/Home'
import Navbar from './components/Navbar/Navbar'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Favourites from './pages/Favourites/Favourites'
import Albums from './pages/Albums/Albums'
import Album from './pages/Album/Album'

// Crear QueryClient fuera del componente para evitar recrearlo en cada render
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0, // Los datos están frescos por 0 ms (siempre stale)
      refetchOnWindowFocus: false,
      refetchOnMount: true, // Refetch cuando el componente se monta
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
            <Route
              path='/favourites'
              element={<Favourites />}
            />
            <Route
              path='/albums'
              element={<Albums />}
            />
            <Route
              path='/albums/:id'
              element={<Album />}
            />
          </Routes>
        </div>
      </div>
    </QueryClientProvider>
  )
}

export default App
