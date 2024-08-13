import useImageLoader from '../helpers/useImageLoader'
import { User } from '../User/UserImagesStacked'

const useUserImagesLoader = (users: User[] | undefined | null) => {
  // we only ever show 2 at once so only check first 2 images
  const user1 = users && users[0]
  const user2 = users && users[1]

  const user1Image =
    user1?.avatarUrl || (user1?.name ? `/api/users/${user1?.name}/avatar` : undefined)
  const user2Image =
    user2?.avatarUrl || (user2?.name ? `/api/users/${user2?.name}/avatar` : undefined)

  const [isUser1Loading, isUser1Error] = useImageLoader(user1 && user1Image)
  const [isUser2Loading, isUser2Error] = useImageLoader(user2 && user2Image)

  // return early if no users
  if (!users?.length) return { users: [], isLoading: false }

  // build User image object for users
  const updatedUsersImages = users?.map((user, i) => {
    let avatarUrl

    if (i === 0) {
      avatarUrl = isUser1Loading || isUser1Error ? undefined : user1Image
    } else if (i === 1) {
      avatarUrl = isUser2Loading || isUser2Error ? undefined : user2Image
    }

    return {
      ...user,
      avatarUrl,
    }
  })

  return {
    users: updatedUsersImages,
    isLoading: isUser1Loading || isUser2Loading,
  }
}

export default useUserImagesLoader
