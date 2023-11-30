import "./index.css"
import App from "./App"
import React from "react"
import { RecoilRoot } from "recoil"
import ReactDOM from "react-dom/client"
import reportWebVitals from "./reportWebVitals"

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)
document.documentElement.lang = "ko"
document.title = "Wetube"

root.render(
  <React.StrictMode>
    <RecoilRoot>
      <App />
    </RecoilRoot>
  </React.StrictMode>,
)

reportWebVitals()
