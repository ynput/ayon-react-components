import { useEffect, useRef, useState } from 'react'

interface UseCompactDisplayProps {
  containerRef: React.RefObject<HTMLElement>
  contentRef: React.RefObject<HTMLElement>
  threshold?: number
  buttonSpace?: number
  hysteresis?: number
  dependencies?: any[]
}

/**
 * A hook that tracks element widths and determines if a compact display mode should be used
 * based on available space.
 */
export const useCompactDisplay = ({
  containerRef,
  contentRef,
  threshold = 10,
  buttonSpace = 56, // Combined width of icons/buttons
  hysteresis = 15, // Extra space needed to exit compact mode
  dependencies = [],
}: UseCompactDisplayProps) => {
  const [isCompact, setIsCompact] = useState(false)
  // Use a ref to store the non-compact width to prevent oscillation
  const nonCompactWidthRef = useRef<number | null>(null)

  useEffect(() => {
    // Store last update timestamp to throttle updates
    let lastUpdate = 0
    const throttleTime = 100 // milliseconds

    const checkWidths = () => {
      // Throttle checks to avoid excessive updates
      const now = Date.now()
      if (now - lastUpdate < throttleTime) return
      lastUpdate = now

      if (!containerRef.current || !contentRef.current) return

      const containerWidth = containerRef.current.clientWidth
      const contentWidth = contentRef.current.clientWidth
      const availableSpace = containerWidth - buttonSpace

      // Only measure and store non-compact width when not in compact mode
      // This ensures we have a stable reference point
      if (!isCompact) {
        // Only update the stored value when it changes significantly (by more than 5px)
        if (
          nonCompactWidthRef.current === null ||
          Math.abs(nonCompactWidthRef.current - contentWidth) > 5
        ) {
          nonCompactWidthRef.current = contentWidth
        }
      }

      // Always use stored non-compact width for comparison when available
      const widthToCompare =
        nonCompactWidthRef.current !== null ? nonCompactWidthRef.current : contentWidth

      // Add hysteresis: require more space to exit compact mode than to enter it
      // This prevents toggling back and forth at the threshold
      const shouldBeCompact = isCompact
        ? availableSpace - widthToCompare < threshold + hysteresis // Need extra space to exit compact mode
        : availableSpace - widthToCompare < threshold // Less strict to enter compact mode

      if (shouldBeCompact !== isCompact) {
        setIsCompact(shouldBeCompact)
      }
    }

    // Initial check
    checkWidths()

    // Use a more efficient approach with ResizeObserver
    const resizeObserver = new ResizeObserver(() => {
      // Request animation frame to batch updates and avoid layout thrashing
      requestAnimationFrame(checkWidths)
    })

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    if (contentRef.current) {
      resizeObserver.observe(contentRef.current)
    }

    // Cleanup observer on unmount
    return () => {
      resizeObserver.disconnect()
    }
  }, [isCompact, containerRef, contentRef, threshold, buttonSpace, hysteresis, ...dependencies])

  return isCompact
}
