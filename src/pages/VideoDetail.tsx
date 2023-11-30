import Comment from "@components/Comment"
import Spinner from "@components/Spinner"
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import AddComment from "@components/AddComment"
import { filterComment } from "@api/commentApi"
import getRelatedVideo from "@api/getRelatedVideo"
import { CommentType, VideoItem } from "interface"
import RelatedVideo from "@components/RelatedVideo"
import VideoDetailItem from "@components/VideoDetailItem"
import formatDateDifference from "@api/formatDateDifference"

function VideoDetail() {
  const location = useLocation()
  const locationRoute = location.state.item.snippet
  const videoId = location.state.item.id

  const [isLoading, setIsLoading] = useState(false)
  const [, setWindowWidth] = useState(window.outerWidth)
  const [pageToken, setPageToken] = useState<string>("")
  const [scrollFetching, setScrollFetching] = useState(false)
  const [detailData, setDetailData] = useState<VideoItem[]>([])
  const [dataVariable, setDataVariable] = useState<string[]>([])
  const [commentData, setCommentData] = useState<CommentType[]>([])

  useEffect(() => {
    const fetchDetailData = async () => {
      try {
        setIsLoading(true)
        const response = await getRelatedVideo(locationRoute)
        const formattedDates = response.items.map((item: VideoItem) => {
          return formatDateDifference(item.snippet.publishedAt)
        })

        setDataVariable(formattedDates)
        setDetailData(response.items)
        setPageToken(response.nextPageToken)
      } catch (error) {
        console.error("Error fetching detail data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDetailData()
  }, [locationRoute.channelId])

  useEffect(() => {
    const promiseData = filterComment(location.state.item.id, 0, 2)
    promiseData
      .then((comments) => {
        setCommentData(comments || [])
      })
      .catch((error) => {
        console.error("에러 발생: ", error)
      })
  }, [])

  // 반응형
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const fetchMoreData = async () => {
    try {
      setIsLoading(true)
      setScrollFetching(true)

      const moreRelatedVideos = await getRelatedVideo(locationRoute, pageToken)
      if (!moreRelatedVideos) {
        console.error("getRelatedVideo did not return any data")
        return
      }

      if (!moreRelatedVideos.nextPageToken) {
        console.log("No more related videos available")
        return
      }
      setPageToken(moreRelatedVideos.nextPageToken)
      setDetailData((prevData) => [...prevData, ...moreRelatedVideos.items])

      const startRange = commentData.length
      const endRange = startRange + 2

      const moreDataComments = await filterComment(
        location.state.item.id,
        startRange,
        endRange,
      )

      if (moreDataComments) {
        setCommentData((prevData) => [...(prevData || []), ...moreDataComments])
        console.log("33")
      }
    } catch (error) {
      console.error(`❌ 에러가 발생하였습니다 : ${error}`)
    } finally {
      setIsLoading(false)
      setScrollFetching(false)
    }
  }

  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight
    const scrollTop = document.documentElement.scrollTop
    const clientHeight = document.documentElement.clientHeight

    if (scrollTop + clientHeight >= scrollHeight - 1 && !scrollFetching) {
      fetchMoreData()
    }
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [handleScroll])

  // 수정 & 삭제버튼 이벤트 콜백함수
  const handleOptionBtnCallback = async () => {
    try {
      const updatedComments = await filterComment(location.state.item.id, 0, 2)
      setCommentData(updatedComments || [])
    } catch (error) {
      console.error("댓글 수정 및 가져오기 실패:", error)
    }
  }

  const renderCommentsSection = () => (
    <div className="min-w-[360px] lgpc:mt-3 pc:mt-3">
      <AddComment
        videoId={location.state.item.id}
        setCommentData={setCommentData}
      />
      {commentData.map((item, index) => (
        <Comment
          key={`${item.anonymous_user_id}_${index}`}
          commentId={item.anonymous_user_id}
          date={item.created_at}
          text={item.text}
          setCommentData={setCommentData}
          videoId={location.state.item.id}
          optionBtnCallback={handleOptionBtnCallback}
        />
      ))}
    </div>
  )

  const renderRelatedSection = () => (
    <div className="min-w-[360px]  tb:mt-3 mo:mt-3  pc:col-span-1">
      <h3 className="sr-only">관련된 영상</h3>
      {detailData?.map((item, index) => (
        <RelatedVideo
          key={`${item.id}_${index}`}
          item={item}
          date={dataVariable[index]}
        />
      ))}
    </div>
  )

  return (
    <div className="py-6 px-4 dark:bg-[#202124] dark:text-white pc:grid pc:grid-cols-4 gap-3 lgpc:grid lgpc:grid-cols-4">
      <h2 className="sr-only">유튜브 상세 페이지</h2>
      {/* 왼쪽 윗칸 차지 */}
      <section className="w-full pb-10 flex-shrink pc:col-span-3 lgpc:col-span-3 auto-rows-fr ">
        {isLoading && <Spinner />}
        <h3 className="sr-only">해당 영상</h3>
        <div className="min-w-[360px]">
          <section key={location.state.item.id}>
            <VideoDetailItem
              item={locationRoute}
              imageUrl={locationRoute.thumbnails?.maxres?.url || ""}
              videoId={videoId}
            />
          </section>
        </div>

        {/* 왼쪽 아래칸 차지 */}
        {window.innerWidth > 1024
          ? renderCommentsSection()
          : renderRelatedSection()}
      </section>
      {/* 오른쪽 세로로 두칸 차지 */}
      {window.innerWidth > 1024
        ? renderRelatedSection()
        : renderCommentsSection()}
    </div>
  )
}

export default VideoDetail
