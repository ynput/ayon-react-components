import { useState, useEffect } from 'react'

const useImageLoading = (imageUrl: string = '', isLoading: boolean) => {
  const [isImageLoading, setIsImageLoading] = useState(true)
  const [isImageValid, setIsImageValid] = useState(false)

  useEffect(() => {
    if (isLoading) {
      setIsImageLoading(true)
      setIsImageValid(false)
      return
    }

    const img = new Image()
    img.onload = () => {
      setIsImageLoading(false)
      setIsImageValid(true)
    }
    img.onerror = () => {
      setIsImageValid(false)
      setIsImageLoading(false)
    }
    img.src = imageUrl
  }, [imageUrl, isLoading])

  return [isImageLoading, isImageValid]
}

export default useImageLoading
