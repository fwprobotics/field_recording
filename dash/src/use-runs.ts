import { atom, useAtom } from "jotai"




type Config = {
  selected: Number,
  view: "merged" | "bird" | "close" | "robot" | "cropped"
}

const configAtom = atom<Config>({
  selected: 1,
    view: "merged",
})

export function useRun() {
  return useAtom(configAtom)
}