import styles from './Tooltip.module.css'
import type { TooltipProps } from '../../types'

const Tooltip = ({ text, position }: TooltipProps) => {
  return (
    <div
      className={position === 'top' ? styles.tooltipTop : position === 'bottom' ? styles.tooltipBottom : styles.tooltipBottomLeft}
    >
      <span>{text}</span>
    </div>
  )
}

export default Tooltip
