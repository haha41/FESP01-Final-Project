import { useRecoilState } from "recoil"
import { useEffect, useState } from "react"
import { searchBarValueAtom } from "@store/searchBarValueAtom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"

function SearchBar() {
  const [searchBarValue, setSearchBarValue] = useRecoilState(searchBarValueAtom)
  const [searchBarClicked, setSearchBarClicked] = useState(false)
  const [, setWindowWidth] = useState(window.outerWidth)

  const handleSearchBarClicked = () => {
    setSearchBarClicked((prevClicked) => !prevClicked)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (searchBarValue === "") {
        return
      } else {
        handleSearchPopularVideo(e)
      }
    }
  }

  const handleSearchPopularVideo = (
    event: React.ChangeEvent<HTMLInputElement> | React.KeyboardEvent<Element>,
  ) => {
    setSearchBarValue(
      (event as React.ChangeEvent<HTMLInputElement>).target.value,
    )
  }

  // 반응형
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const resizeSearchBar = () => (
    <div className="flex justify-center items-center border rounded-[35px] sm:w-full lgpc:w-[45rem] pc:w-[39.375rem] tb:w-[38.85rem] mo:w-[37rem] dark:bg-[#202124] dark:text-white">
      <div className="flex justify-between w-full sm:w-full md:w-full lg:w-[39.375rem] pc:w-[39.375rem] ">
        <div
          className={`w-full h-[2.5rem] ${
            searchBarClicked ? "border-[#e6e6e6]" : "border-[#1A62B9]"
          } border flex items-center rounded-s-[35px] pl-4`}
        >
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="text-[14px] font-light text-[#111] dark:text-white"
          />
          <input
            type="text"
            placeholder="검색"
            className="w-full mx-4 focus:outline-none dark:bg-[#202124]"
            onClick={handleSearchBarClicked}
            onBlur={handleSearchPopularVideo}
            onKeyDown={handleKeyDown}
          />
        </div>
        <button
          type="button"
          aria-label="검색"
          className="w-[4.0625rem] bg-[#F0F0F0] border-l-0 border rounded-e-[35px] hover:bg-slate-200 hover:border-gray-300 hover:border"
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} className="text-[#111]" />
        </button>
      </div>
    </div>
  )

  const moSearchBar = () => (
    <button
      type="button"
      aria-label="검색"
      className="w-11 h-11 aspect-square rounded-full bg-[#F0F0F0] "
    >
      <FontAwesomeIcon icon={faMagnifyingGlass} className="text-[#222222]" />
    </button>
  )

  return <>{window.innerWidth < 450 ? moSearchBar() : resizeSearchBar()}</>
}

export default SearchBar
