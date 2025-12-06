import styles from './Tooltip.module.css'
import type { TooltipProps } from '../../types'

const Tooltip = ({ text, position }: TooltipProps) => {
  return (
    <div
      className={position === 'top' ? styles.tooltipTop : styles.tooltipBottom}
    >
      <span>{text}</span>
    </div>
  )
}

export default Tooltip
