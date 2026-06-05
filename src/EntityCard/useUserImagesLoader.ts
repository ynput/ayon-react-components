import { User } from '../User/UserImagesStacked'

const useUserImagesLoader = (users: User[] | undefined | null) => {
  // return early if no users
  if (!users?.length) return []

  // build User image object for users
  const updatedUsersImages = users?.map((user) => {
    const avatarUrl =
      user?.avatarUrl || (user?.name ? `/api/users/${user?.name}/avatar` : undefined)

    return {
      ...user,
      avatarUrl,
    }
  })

  return updatedUsersImages
}

export default useUserImagesLoader
