import axios from "axios"

const getVideoAPI = async (pageToken: string | null = null) => {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&maxResults=12&regionCode=KR&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`,
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

export default getVideoAPI
