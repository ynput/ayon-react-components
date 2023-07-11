const getRandomImage = (seed?: string) => {
  // if no seed create one
  if (!seed) {
    seed = Math.floor(Math.random() * 100).toString()
  }

  // random width between 200 and 1000
  const width = Math.floor(Math.random() * 800) + 200
  const height = Math.floor(Math.random() * 800) + 200
  const randomImage = `
  https://picsum.photos/seed/${seed}/${width}/${height}
  `

  return randomImage
}

export default getRandomImage
