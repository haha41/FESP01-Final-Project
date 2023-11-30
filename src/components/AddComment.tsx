import Button from "./Button"
import { AddCommentProps } from "interface"
import { enterComment } from "@api/commentApi"
import React, { useEffect, useRef, useState } from "react"

function AddComment({ videoId }: AddCommentProps) {
  const [text, setText] = useState<string>("")
  const [isFocus, setIsFocus] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleInputFocus = () => {
    setIsFocus(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
  }

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setIsFocus(false)
    setText("")
  }

  const handleCommentSubmit = async () => {
    await enterComment(text, videoId)
    setText("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (text === "") {
        return
      } else {
        handleCommentSubmit()
      }
    }
  }

  // useEffect를 사용하여 텍스트가 변경될 때마다 높이를 조절합니다.
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "30px"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [text])

  return (
    <div className="w-full pb-2">
      <div className="h-auto flex">
        <div className="min-h-[102px] pr-4">
          <div className="w-[40px] h-[40px] rounded-full overflow-hidden">
            <img
              src="/smile.png"
              alt="프로필 사진"
              className="w-full h-full object-cover"
            ></img>
          </div>
        </div>

        <form className=" w-full flex-col gap-10">
          <textarea
            ref={textareaRef}
            placeholder="댓글 추가..."
            className="w-full border-b-2 mb-2 focus:outline-none focus:border-b-slate-500 overflow-hidden resize-none"
            value={text}
            onFocus={handleInputFocus}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />

          {isFocus && (
            <div className="flex gap-3 justify-end">
              <Button
                text={"취소"}
                type={"button"}
                onClick={handleCancel}
                activeClass="hover:bg-slate-200"
              />
              <Button
                text={"등록"}
                type={"button"}
                onClick={handleCommentSubmit}
                color={
                  text ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700"
                }
              />
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default AddComment
