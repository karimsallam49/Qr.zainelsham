import { Outlet } from "react-router"
import { AppFooter } from "../AppFooter/AppFooter"

const AppLayout = () => {
  return (
    <div className="w-100">
      <div className="outlet-contain">
        <Outlet/>
      </div>
      <AppFooter/>
    </div>
  )
}

export default AppLayout
