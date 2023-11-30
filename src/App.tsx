import "./tailwind.css"
import NotFound from "@pages/NotFound"
import VideoMain from "@pages/VideoMain"
import VideoDetail from "@pages/VideoDetail"
import { RootLayout } from "@layout/RootLayout/RootLayout"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<VideoMain />} />
          <Route path="videoDetail/:id" element={<VideoDetail />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
