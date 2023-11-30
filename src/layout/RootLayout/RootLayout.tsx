import Header from "../Header"
import { Outlet } from "react-router-dom"

export const RootLayout = (): JSX.Element => {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  )
}
