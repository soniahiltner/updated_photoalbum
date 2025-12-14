import { useState } from 'react'

export const useIconHover = () => {
  const [hovering, setHovering] = useState(false)

  const handleMouseOver = () => setHovering(true)
  const handleMouseOut = () => setHovering(false)

  return {
    hovering,
    hoverHandlers: {
      onMouseOver: handleMouseOver,
      onMouseOut: handleMouseOut
    }
  }
}
