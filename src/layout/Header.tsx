import React from "react"
import { Link } from "react-router-dom"
import SearchBar from "@components/SearchBar"
import BackButton from "@components/BackButton"
import { faUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const Header = React.memo(function Header() {
  return (
    <header className="flex justify-between px-8 pt-2 pb-8 items-center dark:bg-[#202124] dark:text-white">
      <div className="flex items-center">
        <BackButton />
        <Link to="/">
          <div className="flex items-center gap-4 h-4 w-13 p-2 mr-10">
            <img
              src="/youtubeLogo.svg"
              alt="로고"
              className="w-12 h-12 mx-10"
            />
          </div>
        </Link>
      </div>

      <SearchBar />
      <button className="w-28 h-11 ml-5 mo:ml-1 border rounded-[35px] p-4 border-[#e6e6e6] focus:border-none hover:bg-[#DEF0FE] flex justify-center items-center gap-2 dark:bg-[#202124]">
        <FontAwesomeIcon icon={faUser} />
        <span className="w-20">로그인</span>
      </button>
    </header>
  )
})

export default Header
