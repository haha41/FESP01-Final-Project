import axios from "axios"

const getVideoData = async () => {
  try {
    const response = await axios.get("/videos/popular.json")
    return response.data
  } catch (error) {
    console.error(`❌ 에러가 발생하였습니다 : ${error}`)
    throw error
  }
}

export default getVideoData
