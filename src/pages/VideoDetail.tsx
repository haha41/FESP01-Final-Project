import axios from "axios"
import { CommentType, VideoItem } from "interface"
import Comment from "@components/Comment"
import { Suspense, useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import AddComment from "@components/AddComment"
import VideoDetailItem from "@components/VideoDetailItem"
import formatDateDifference from "@api/formatDateDifference"
import { filterComment, readComment } from "@api/commentApi"

// React.lazy를 사용하여 RelatedVideo 컴포넌트를 동적으로 로딩
const LazyRelatedVideo = React.lazy(() => import("@components/RelatedVideo"))

function VideoDetail() {
  const location = useLocation()
  const locationRoute = location.state.item.snippet
  const [detailData, setDetailData] = useState<VideoItem[]>([])
  const [dataVariable, setDataVariable] = useState<string[]>([])
  const [commentData, setCommentData] = useState<CommentType[]>([])
  const [windowWidth, setWindowWidth] = useState(window.outerWidth)

  useEffect(() => {
    const fetchDetailData = async () => {
      try {
        const response = await axios.get(
          `/videos/searchByChannels/search-by-channel-id-${locationRoute.channelId}.json`,
        )
        const formattedDates = response.data.items.map((item: VideoItem) => {
          return formatDateDifference(item.snippet.publishedAt)
        })
        setDataVariable(formattedDates)
        setDetailData(response.data.items)
      } catch (error) {
        console.error("Error fetching detail data:", error)
      }
    }

    fetchDetailData()
  }, [locationRoute.channelId])

  useEffect(() => {
    const promiseData = filterComment(location.state.item.id)
    promiseData
      .then((comments) => {
        setCommentData(comments || [])
      })
      .catch((error) => {
        console.error("에러 발생: ", error)
      })
  }, [])

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.outerWidth)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const renderCommentsSection = () => (
    <div className="min-w-[360px] lgpc:mt-3 pc:mt-3">
      <AddComment
        videoId={location.state.item.id}
        setCommentData={setCommentData}
      />
      {commentData.map((item) => (
        <Comment
          key={item.id}
          commentId={item.anonymous_user_id}
          date={item.created_at}
          text={item.text}
          setCommentData={setCommentData}
          videoId={location.state.item.id}
        />
      ))}
    </div>
  )

  const renderRelatedSection = () => (
    <div className="min-w-[360px]  tb:mt-3 mo:mt-3  pc:col-span-1">
      <h3 className="sr-only">관련된 영상</h3>
      {detailData?.map((item, index) => (

      {/* Suspense로 감싸서 로딩 시 fallback UI를 표시 */}
      <Suspense fallback={<div>Loading...</div>}>
        <LazyRelatedVideo
          key={`${item.id}_${index}`}
          item={item}
          date={dataVariable[index]}
        />
      </Suspense>
            ))}

    </div>
  )

  return (
    <div className="py-6 px-4 dark:bg-[#202124] dark:text-white pc:grid pc:grid-cols-4 gap-3 lgpc:grid lgpc:grid-cols-4">
      <h2 className="sr-only">유튜브 상세 페이지</h2>

      {/* 왼쪽 윗칸 차지 */}
      <section className="w-full pb-10 flex-shrink pc:col-span-3 lgpc:col-span-3 auto-rows-fr">
        <h3 className="sr-only">해당 영상</h3>
        <div className="min-w-[360px]">
          <ul key={location.state.item.id}>
            <VideoDetailItem
              item={locationRoute}
              imageUrl={locationRoute.thumbnails?.maxres?.url || ""}
            />
          </ul>
        </div>

        {/* 왼쪽 아래칸 차지 */}
        {window.outerWidth > 1024
          ? renderCommentsSection()
          : renderRelatedSection()}
      </section>
      {/* 오른쪽 세로로 두칸 차지 */}
      {window.outerWidth > 1024
        ? renderRelatedSection()
        : renderCommentsSection()}
    </div>
  )
}

export default VideoDetail
