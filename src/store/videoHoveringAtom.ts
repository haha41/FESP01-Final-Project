import { RecoilState, atom } from "recoil"

export const videoHoveringAtom = (videoId: string) => {
  const key = `videoHoveringAtom_${videoId}`
  return atom({
    key,
    default: false,
  }) as RecoilState<boolean> // 반환 타입을 명시적으로 지정
}
export const videoHoverVideoIdAtom = (videoId: string) => {
  const key = `videoHoverVideoIdAtom${videoId}`
  return atom({
    key,
    default: "",
  })
}
