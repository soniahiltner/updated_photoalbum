import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router'
import AlbumListItem from '../components/AlbumListItem/AlbumListItem'
import type { AlbumType } from '../types'

// Mock API service
vi.mock('../api/images', () => ({
  imageService: {
    getAlbumLastImage: vi.fn()
  }
}))

// Mock DeleteAlbumIcon component
vi.mock('../components/DeleteAlbumIcon/DeleteAlbumIcon', () => ({
  default: () => <div data-testid='delete-album-icon'>Delete</div>
}))

describe('AlbumListItem Component', () => {
  let queryClient: QueryClient

  const mockAlbum: AlbumType = {
    _id: 'album1',
    name: 'Vacation Photos'
  }

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false
        }
      }
    })
  })

  const renderComponent = (album: AlbumType) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AlbumListItem album={album} />
        </BrowserRouter>
      </QueryClientProvider>
    )
  }

  it('renders album name', () => {
    renderComponent(mockAlbum)
    expect(screen.getByText('Vacation Photos')).toBeInTheDocument()
  })

  it('renders delete album icon', () => {
    renderComponent(mockAlbum)
    expect(screen.getByTestId('delete-album-icon')).toBeInTheDocument()
  })

  it('shows "Empty album" message when no image', async () => {
    renderComponent(mockAlbum)

    // Wait for query to complete
    await screen.findByText('Empty album')
    expect(screen.getByText('Empty album')).toBeInTheDocument()
  })
})
