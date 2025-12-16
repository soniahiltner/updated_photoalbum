import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Image from '../components/Image/Image'
import type { Image as ImageType, AlbumType } from '../types'

// Mock Icons component
vi.mock('../components/Icons/Icons', () => ({
  default: () => <div data-testid='icons-mock'>Icons</div>
}))

describe('Image Component', () => {
  const mockImage: ImageType = {
    _id: '1',
    filename: 'test-image.jpg',
    url: 'https://example.com/image.jpg',
    isFavourite: false,
    albums: []
  }

  const mockHandleOpenModal = vi.fn()

  const defaultProps = {
    image: mockImage,
    index: 0,
    handleOpenModal: mockHandleOpenModal
  }

  it('renders image with correct src and alt', () => {
    render(<Image {...defaultProps} />)

    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', mockImage.url)
    expect(img).toHaveAttribute('alt', mockImage.filename)
  })

  it('calls handleOpenModal when image is clicked', async () => {
    const user = userEvent.setup()
    render(<Image {...defaultProps} />)

    const img = screen.getByRole('img')
    await user.click(img)

    expect(mockHandleOpenModal).toHaveBeenCalledWith(0)
    expect(mockHandleOpenModal).toHaveBeenCalledTimes(1)
  })

  it('renders Icons component', () => {
    render(<Image {...defaultProps} />)
    expect(screen.getByTestId('icons-mock')).toBeInTheDocument()
  })

  it('has tabIndex for keyboard accessibility', () => {
    render(<Image {...defaultProps} />)
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('tabIndex', '0')
  })

  it('passes favouritesOnly prop to Icons', () => {
    render(
      <Image
        {...defaultProps}
        favouritesOnly={true}
      />
    )
    expect(screen.getByTestId('icons-mock')).toBeInTheDocument()
  })

  it('passes album prop to Icons', () => {
    const mockAlbum: AlbumType = {
      _id: 'album1',
      name: 'Test Album'
    }
    render(
      <Image
        {...defaultProps}
        album={mockAlbum}
      />
    )
    expect(screen.getByTestId('icons-mock')).toBeInTheDocument()
  })
})
