import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Loader from '../components/Loader/Loader'

describe('Loader Component', () => {
  it('renders spinner icon', () => {
    const { container } = render(<Loader />)
    const spinner = container.querySelector('i.fa-spinner')
    expect(spinner).toBeInTheDocument()
  })

  it('has correct FontAwesome classes', () => {
    const { container } = render(<Loader />)
    const icon = container.querySelector('i')
    expect(icon).toHaveClass('fa', 'fa-spinner', 'fa-spin')
  })

  it('has centered text alignment', () => {
    const { container } = render(<Loader />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveStyle({ textAlign: 'center' })
  })
})
