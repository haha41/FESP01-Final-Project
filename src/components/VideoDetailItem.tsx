import axios from "axios"
import { useRecoilState } from "recoil"
import { VideoSnippet } from "interface"
import { useEffect, useState } from "react"
import { channelThumbnailAtom } from "@store/channelThumbnailAtom"

export interface VideoDetailItemProps {
  item: VideoSnippet
  imageUrl: string
  videoId: string
}

function VideoDetailItem({ item, videoId }: VideoDetailItemProps) {
  const [viewMore, setViewMore] = useState(false)
  const channelId = item?.channelId
  const [channelThumbnail, setChannelThumbnail] = useRecoilState(
    channelThumbnailAtom(channelId),
  )
  const [channelDescription, setChannelDescription] = useState()

  const viewDescription = () => {
    if (!viewMore) {
      const firstLine = item.description.split("\n")[0]
      return <span className=" block mb-2">{firstLine}</span>
    } else {
      return (
        <span className="whitespace-pre-line block mb-2">
          {item.description}
        </span>
      )
    }
  }

  useEffect(() => {
    const channelDetail = async () => {
      try {
        const response = await axios.get(
          `https://youtube.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`,
        )

        const channelThumbnailUrl = response.data.items.map(
          (item: any) => item?.snippet?.thumbnails?.high.url,
        )[0]

        const channelThumbnailDescription = response.data.items[0].snippet.title

        setChannelThumbnail(channelThumbnailUrl)
        setChannelDescription(channelThumbnailDescription)
      } catch (error) {
        console.error("Error fetching detail data:", error)
      }
    }

    channelDetail()
  }, [channelId, setChannelThumbnail])

  return (
    <>
      <iframe
        id="ytplayer"
        src={`https://www.youtube.com/embed/${videoId}?amp;autoplay=1`}
        allowFullScreen
        className="aspect-video w-full"
        allow="autoplay"
      ></iframe>
      <ul className=" grid  grid-cols-[50px_minmax(20px,_1fr)_100px] gap-1">
        <li
          id="title"
          className="text-lg font-semibold  tb:w-full min-w-[360px] mt-3 col-start-2 col-end-7 row-start-1"
        >
          {item.title}
        </li>
        <img
          src={channelThumbnail}
          alt={channelDescription}
          className="w-[50px] h-[50px] rounded-full col-start-1 auto-rows-min auto-cols-min mt-3  "
        />
        <li className="text-sm  tb:w-full min-w-[360px] mb-2 col-start-2">
          {item.channelTitle}
        </li>
      </ul>
      <div
        className={`bg-[#F2F2F2] text-base  tb:w-full min-w-[360px] p-6 rounded-md mt-1 cursor-pointer`}
        onClick={() => setViewMore(!viewMore)}
      >
        {viewDescription()}
        <span className="text-gray-500">
          {viewMore === false ? "더보기..." : "간략히"}
        </span>
      </div>
    </>
  )
}

export default VideoDetailItem
