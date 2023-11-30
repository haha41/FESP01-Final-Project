import { VideoItem } from "../interface"
import Spinner from "@components/Spinner"
import getVideoAPI from "@api/getVideoAPI"
import { useEffect, useState } from "react"
import { videoAtom } from "@store/videoAtom"
import { useRecoilState, useRecoilValue } from "recoil"
import VideoComponents from "@components/VideoComponets"
import formatDateDifference from "@api/formatDateDifference"
import { searchBarValueAtom } from "@store/searchBarValueAtom"

function VideoMain() {
  const [isLoading, setIsLoading] = useState(true)
  const [pageToken, setPageToken] = useState<string>()
  const searchBarValue = useRecoilValue(searchBarValueAtom)
  const [scrollFetching, setScrollFetching] = useState(false)
  const [dataVariable, setDataVariable] = useState<string[]>([])
  const [videoData, setVideoData] = useRecoilState<VideoItem[]>(videoAtom)

  useEffect(() => {
    const dataFetching = async () => {
      try {
        setIsLoading(true)
        const response = await getVideoAPI()
        const formattedDates = response?.items?.map((item: VideoItem) => {
          return formatDateDifference(item.snippet.publishedAt)
        })

        setVideoData(response.items)
        setDataVariable(formattedDates)
        setPageToken(response.nextPageToken)
      } catch (error) {
        console.error(`❌ 에러가 발생하였습니다 : ${error}`)
      } finally {
        setIsLoading(false)
      }
    }

    dataFetching()
  }, [])

  const fetchMoreData = async () => {
    try {
      setIsLoading(true)
      setScrollFetching(true)
      const moreData = await getVideoAPI(pageToken)
      setPageToken(moreData.nextPageToken)
      setVideoData((prevData) => [...prevData, ...moreData.items])

      const formattedDates = moreData.items.map((item: VideoItem) => {
        return formatDateDifference(item.snippet.publishedAt)
      })
      setDataVariable((prevDates) => [...prevDates, ...formattedDates])
    } catch (error) {
      console.error(`❌ 에러가 발생하였습니다 : ${error}`)
    } finally {
      setIsLoading(false)
      setScrollFetching(false)
    }
  }

  const filteredData = videoData.filter((video) =>
    video.snippet.title.toLowerCase().includes(searchBarValue.toLowerCase()),
  )

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

  return (
    <div className="py-6 px-8 dark:bg-[#202124] dark:text-white">
      <h1 className="sr-only">유튜브 목록 페이지</h1>
      {isLoading && <Spinner />}
      <section className="flex flex-col mx-auto tb:grid tb:grid-flow-row tb:grid-cols-2 pc:grid pc:grid-cols-3 lgpc:grid lgpc:grid-cols-4 gap-4 min-w-[360px]">
        {filteredData?.map((item, index) => (
          <VideoComponents
            page="main"
            key={`${item.id}_${index}`}
            item={item}
            date={dataVariable[index]}
          />
        ))}
        {isLoading && <Spinner />}
      </section>
    </div>
  )
}

export default VideoMain
