import axios from "axios"
import { VideoSnippet } from "interface"

const getRelatedVideo = async (
  locationRoute: VideoSnippet,
  pageToken: string | null = null,
) => {
  try {
    const response = await axios.get(
      `https://youtube.googleapis.com/youtube/v3/playlists?part=snippet%2CcontentDetails&channelId=${locationRoute.channelId}&maxResults=5&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        params: {
          pageToken,
        },
      },
    )

    return response.data
  } catch (error) {
    console.error(`❌ 에러가 발생하였습니다 : ${error}`)
    throw error
  }
}

export default getRelatedVideo
