import { atom } from "recoil"

export const channelThumbnailAtom = (channelId: string) => {
  const key = `channelThumbnailStore_${channelId}`
  return atom({
    key,
    default: "",
  })
}
