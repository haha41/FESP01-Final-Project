import { createClient } from "@supabase/supabase-js"

const supabaseAdmin = createClient(
  "https://ufinqahbxsrpjbqmrvti.supabase.co",
  process.env.REACT_APP_SUPABASE_PROJECT_API_KEY as string,
)

// 댓글 등록 API
export const enterComment = async (text: string, video_id: string) => {
  try {
    const { data, error } = await supabaseAdmin.from("video_comment").insert([
      {
        text,
        video_id,
      },
    ])

    if (error) {
      console.error(`데이터 통신에 실패하였습니다..😵‍💫 ${error.message}`)
    } else {
      console.log("Supabase 데이터 삽입 성공:", data)
    }
  } catch (error) {
    console.error(`데이터 통신에 실패하였습니다..😵‍💫 ${error}`)
  }
}

// 댓글 삭제 API
export const deleteComment = async (commentId: string) => {
  const { data, error } = await supabaseAdmin
    .from("video_comment")
    .delete()
    .eq("anonymous_user_id", commentId)

  if (error) {
    console.error("Error deleting comment:", error.message)
  } else {
    console.log("Comment deleted successfully:", data)
  }
}

// 댓글 가져오기 API
export const readComment = async () => {
  try {
    const { data, error } = await supabaseAdmin
      .from("video_comment")
      .select("*")

    if (error) {
      console.error(`데이터 통신에 실패하였습니다..😵‍💫 ${error.message}`)
    } else {
      return data
    }
  } catch (error) {
    console.error(`데이터 통신에 실패하였습니다..😵‍💫 ${error}`)
    throw error
  }
}

// 댓글 수정 API
export const modifyComment = async (
  anonymous_user_id: string,
  modifyCommentText: string,
) => {
  try {
    const { error } = await supabaseAdmin
      .from("video_comment")
      .update({ text: modifyCommentText })
      .eq("anonymous_user_id", anonymous_user_id)
      .select()

    if (error) {
      console.log("Error deleting comment:", error.message)
    }
  } catch (error) {
    console.error(`데이터 통신에 실패하였습니다..😵‍💫 ${error}`)
    throw error
  }
}

// filterComment 함수의 수정
export const filterComment = async (
  video_id: string,
  startRange: number,
  endRange: number,
) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("video_comment")
      .select("*")
      .eq("video_id", video_id)
      .order("created_at", { ascending: false })
      .range(startRange, endRange)

    if (error) {
      console.error(`데이터 통신에 실패하였습니다..😵‍💫 ${error.message}`)
    } else {
      return data
    }
  } catch (error) {
    console.error(`데이터 통신에 실패하였습니다..😵‍💫 ${error}`)
  }
}
