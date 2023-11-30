import YouTube from "react-youtube"

interface YoutubeVideoProps {
  videoId: string
}

function YoutubeVideo({ videoId }: YoutubeVideoProps) {
  const onPlayerReady = (event: any) => {
    event.target.pauseVideo()
  }

  const opts = {
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  }

  return (
    <div>
      <YouTube videoId={videoId} opts={opts} onReady={onPlayerReady} />
    </div>
  )
}

export default YoutubeVideo
