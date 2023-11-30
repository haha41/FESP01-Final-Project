import { atom } from "recoil"
import { CommentType } from "interface"

export const commetnAtom = atom<CommentType[]>({
  key: "commetnState",
  default: [],
})
