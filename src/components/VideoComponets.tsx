import { Link } from "react-router-dom"
import { VideoItem } from "../interface"
import { motion } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faVolumeLow, faVolumeXmark } from "@fortawesome/free-solid-svg-icons"
import { useEffect, useState } from "react"
import axios from "axios"
import { RecoilEnv, useRecoilState } from "recoil"
import { channelThumbnailAtom } from "@store/channelThumbnailAtom"
import { videoHoveringAtom } from "@store/videoHoveringAtom"

// recoil Key 오류 방지
RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false

interface VideoComponentsProps {
  key: string
  item: VideoItem
  date: string
  page: string
}

function VideoComponents({ item, date, page }: VideoComponentsProps) {
  const channelId = item.snippet.channelId
  const videoId = item.id
  const [isSound, setIsSound] = useState(false)
  const [channelThumbnail, setChannelThumbnail] = useRecoilState(
    channelThumbnailAtom(channelId),
  )
  const [videoHover, setVideoHover] = useRecoilState(videoHoveringAtom(videoId))

  const handleSound = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsSound(!isSound)
    e.preventDefault()
  }

  const handleMouseOver: React.MouseEventHandler<HTMLElement> = () => {
    setVideoHover(true)
  }

  const handleMouseOut: React.MouseEventHandler<HTMLElement> = () => {
    setVideoHover(false)
  }

  useEffect(() => {
    const channelDetail = async () => {
      try {
        const response = await axios.get(
          `https://youtube.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`,
          // `/videos/searchByChannels/search-by-channel-id-${channelId}.json`,
        )

        const channelThumbnailUrl = response.data.items.map(
          (item: any) => item?.snippet?.thumbnails?.high.url,
        )[0]

        setChannelThumbnail(channelThumbnailUrl)
      } catch (error) {
        // console.error("Error fetching detail data:", error)
      }
    }

    channelDetail()
  }, [channelId, setChannelThumbnail])

  const videoImage = () => (
    <img
      src={
        item.snippet.thumbnails.maxres?.url ||
        item.snippet.thumbnails.standard?.url
      }
      alt={item.snippet.title}
      className="mo:flex-shrink rounded-lg hover:rounded-none tb:aspect-video tb:object-cover pc:aspect-video pc:object-cover lgpc:aspect-video lgpc:object-cover"
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    />
  )
  const videoIframe = () => (
    <iframe
      id="ytplayer"
      // type="text/html"
      src={`https://www.youtube.com/embed/${item.id}?autoplay=1&mute=1&controls=0&disablekb=1&modestbranding=1`}
      allowFullScreen
      allow="autoplay"
      className="aspect-video w-full"
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    ></iframe>
  )

  return (
    <div className="relative">
      <Link to={`/videoDetail/${item.id}`} state={{ item: item }}>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }}>
          {videoHover ? videoIframe() : videoImage()}
          <div className="absolute top-1 right-1 group" onClick={handleSound}>
            <button className="p-2">
              <FontAwesomeIcon
                icon={isSound ? faVolumeLow : faVolumeXmark}
                className="text-white"
                title={isSound ? "음소거 해제" : "음소거"}
              />
            </button>
          </div>
        </motion.div>
        <div className="mt-2 mo:mb-3 tb:mb-0 flex gap-2 mo:mt-4 ">
          <img
            src={channelThumbnail}
            alt=""
            className="w-[10%] h-[10%] rounded-full"
          />
          <dl className="grow-0 w-[90%]">
            <dt className="text-lg font-semibold text-ellipsis overflow-hidden truncate">
              {item.snippet.title}
            </dt>
            <dd className={`text-sm ${page === "main" ? "order-first" : ""}`}>
              {item.snippet.channelTitle}
            </dd>
            <dd className="text-base w-[96%] text-ellipsis overflow-hidden truncate">
              {item.snippet.description}
            </dd>
            <dd className="text-sm">{date}</dd>
          </dl>
        </div>
      </Link>
    </div>
  )
}

export default VideoComponents
