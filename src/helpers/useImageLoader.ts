import { useState, useEffect } from 'react'

const useImageLoader = (imageUrl: string | null | undefined, force = false) => {
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(!!imageUrl)

  const setLoadingStates = (loading: boolean, error: boolean) => {
    setIsLoading(loading)
    setIsError(error)
  }

  useEffect(() => {
    // Reset loaded and error states when src changes
    setLoadingStates(true, false)

    if (!imageUrl) return setLoadingStates(false, false)

    // Function to fetch image and check status code
    const fetchImage = async () => {
      try {
        const response = await fetch(imageUrl, { cache: force ? 'force-cache' : 'default' })
        if (response.status === 200) {
          setLoadingStates(false, false)
        } else {
          throw new Error('Image not OK')
        }
      } catch (error) {
        setLoadingStates(false, true)
      }
    }

    if (imageUrl) {
      fetchImage()
    }
  }, [imageUrl])

  return [isLoading, isError]
}

export default useImageLoader
