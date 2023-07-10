import { useState, useEffect } from 'react'

const useImageLoading = (imageUrl: string = '', isLoading: boolean) => {
  const [isImageLoading, setIsImageLoading] = useState(true)
  const [isImageValid, setIsImageValid] = useState(false)
  const [disableAnimation, setDisableAnimation] = useState(false)

  useEffect(() => {
    if (isLoading) {
      setIsImageLoading(true)
      setIsImageValid(false)
    }

    const img = new Image()
    const startTime = performance.now()
    img.onload = () => {
      const loadTime = performance.now() - startTime
      setIsImageLoading(false)
      setIsImageValid(true)
      if (loadTime < 100) {
        setDisableAnimation(true)
      }
    }
    img.onerror = () => {
      setIsImageLoading(false)
    }
    img.src = imageUrl
  }, [imageUrl])

  return [isImageLoading, isImageValid, disableAnimation]
}

export default useImageLoading
