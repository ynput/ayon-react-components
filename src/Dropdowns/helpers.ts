import usersData from './users.json'

// randomly attach an image to the user
export const allUsers = usersData.map((user, i) => {
  let avatarUrl

  if (Math.random() > 0.5) {
    avatarUrl = `https://repo.imm.cz/avatars/demouser${i + 10}.jpg`
  }

  return {
    ...user,
    avatarUrl,
  }
})

export const getRandomUsers = (number?: number) => {
  // if no number, create random between 1 and 5
  number = number || Math.floor(Math.random() * 5) + 1
  const randomUsers = []
  for (let i = 0; i < number; i++) {
    randomUsers.push(allUsers[Math.floor(Math.random() * allUsers.length)])
  }
  return randomUsers
}

export const selectedUsers = getRandomUsers().map((user) => user.name)
