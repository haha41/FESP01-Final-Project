import { useNavigate, useLocation } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons"

function BackButton() {
  const navigate = useNavigate()
  const location = useLocation()

  const handleGoBack = () => {
    navigate(-1)
  }

  // 특정 경로에서만 뒤로 가기 버튼을 보이게 함
  const shouldShowBackButton = location.pathname

  if (!shouldShowBackButton) {
    return null // 특정 조건이 아니면 null을 반환하여 숨김
  }

  return (
    <button onClick={handleGoBack} className="text-xl">
      <FontAwesomeIcon icon={faArrowLeftLong} />
    </button>
  )
}

export default BackButton
