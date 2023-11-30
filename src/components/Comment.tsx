import { useState } from "react"
import { CommentProps } from "interface"
import { faBars } from "@fortawesome/free-solid-svg-icons"
import formatDateDifference from "@api/formatDateDifference"
import { deleteComment, modifyComment } from "@api/commentApi"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faThumbsDown, faThumbsUp } from "@fortawesome/free-regular-svg-icons"

function Comment({ text, date, commentId, optionBtnCallback }: CommentProps) {
  const [count, setCount] = useState(0)
  const [modifyChecked, setModifyChecked] = useState(false)
  const [isBarsVisible, setIsBarsVisible] = useState(false)
  const [isButtonsVisible, setIsButtonsVisible] = useState(false)
  const [modifyCommentText, setModifyCommentText] = useState<string>("")

  const createdDate = formatDateDifference(date)

  const handleLike = () => {
    setCount(count + 1)
  }

  const handleBarsClick = () => {
    setIsButtonsVisible(!isButtonsVisible)
  }

  const handleEditClick = () => {
    setModifyChecked((prevBtn) => !prevBtn)
    if (!modifyChecked) return
    else modifyComment(commentId, modifyCommentText)
    optionBtnCallback()
    alert("댓글이 수정되었습니다! 🛠️")
  }

  const handleDeleteClick = async () => {
    await deleteComment(commentId)
    optionBtnCallback()
    alert("댓글이 삭제되었습니다!")
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setModifyCommentText(e.target.value)
  }

  return (
    <div className="w-full">
      <div
        className="max-h-[142px] flex"
        onMouseEnter={() => setIsBarsVisible(true)}
        onMouseLeave={() => {
          isBarsVisible &&
            !isButtonsVisible &&
            (setIsBarsVisible(false), setIsButtonsVisible(false))
        }}
      >
        <div className="h-auto pr-4">
          <div className="w-[40px] h-[40px] rounded-full overflow-hidden">
            <img
              src="/smile.png"
              alt="프로필 사진"
              className="w-full h-full object-cover"
            ></img>
          </div>
        </div>

        <div className="w-full flex-col gap-10">
          <div className="flex justify-between">
            <div>
              <div className="flex gap-4">
                <div className="flex gap-2 items-end">
                  <p>{commentId}</p>
                  <p className="text-sm">{createdDate}</p>
                </div>
              </div>
              {modifyChecked ? (
                <textarea
                  className="w-full border-b-2 mb-2 focus:outline-none focus:border-b-slate-500 overflow-hidden resize-none"
                  defaultValue={text}
                  onChange={handleInputChange}
                />
              ) : (
                <div>{text}</div>
              )}
              <div className="flex gap-5">
                <div className="flex items-center justify-center">
                  <div
                    onClick={handleLike}
                    className="w-[32px] h-[32px] flex items-center justify-center rounded-full hover:bg-slate-200"
                  >
                    <FontAwesomeIcon icon={faThumbsUp} />
                  </div>
                  {count}
                </div>
                <div className="w-[32px] h-[32px] flex items-center justify-center rounded-full hover:bg-slate-200">
                  <FontAwesomeIcon icon={faThumbsDown} />
                </div>
                <div className="w-[42px] h-[32px] flex items-center justify-center rounded-full hover:bg-slate-200">
                  답글
                </div>
              </div>
            </div>
            <div className="min-w-[30px] flex-col items-center justify-center">
              {isBarsVisible && (
                <div className="flex items-center justify-center">
                  <button className="" onClick={handleBarsClick}>
                    <FontAwesomeIcon icon={faBars} />
                  </button>
                </div>
              )}

              {isBarsVisible && isButtonsVisible && (
                <div className="flex-col items-center justify-center py-2">
                  <div className="flex items-center justify-center pb-2">
                    <button onClick={handleEditClick} className="text-sm ">
                      {modifyChecked ? "수정완료" : "댓글수정"}
                    </button>
                  </div>

                  <div className="flex items-center justify-center">
                    <button onClick={handleDeleteClick} className="text-sm ">
                      삭제
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Comment
