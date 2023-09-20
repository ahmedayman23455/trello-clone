"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { MagnifyingGlassIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import Avatar from "react-avatar";
import { useBoardStore } from "@/store/BoardStore";
import { fetchSuggestion } from "@/lib/fetchSuggestion";

function Header() {
  const [board, searchString, setSearchString] = useBoardStore((state) => [
    state.board,
    state.searchString,
    state.setSearchString,
  ]);

  const [loading, setLoading] = useState<boolean>(false);
  const [suggestion, setSuggestion] = useState<string>("");

  useEffect(() => {
    if (board.columns.size === 0) return;
    setLoading(true);

    const fetchSuggestionFunc = async () => {
      const suggestion = await fetchSuggestion(board);
      setSuggestion(suggestion);
      setLoading(false);
    };

    fetchSuggestionFunc();
  }, [board]);

  return (
    <header>
      <div
        className="absolute top-0  h-96 w-full left-0 
      right-0 bg-gradient-to-br from-pink-400 to-[#0055d1]
      rounded-md filter blur-3xl opacity-50 -z-50
      "
      ></div>

      <div
        className="flex flex-col gap-4 md:flex-row items-center 
 bg-gray-500/10 p-4"
      >
        <Image
          src="https://links.papareact.com/c2cdd5"
          alt="Trello Logo"
          width={300}
          height={100}
          className="w-24 md:w-32  md:pb-0 object-contain"
        />

        <div className=" flex gap-4flex-1 justify-end w-full gap-4">
          {/* search box */}
          <form
            className="flex items-center space-x-1 bg-white rounded-md
           shadow-md px-2 flex-1 md:flex-initial"
          >
            <MagnifyingGlassIcon className="h-6 w-6 shrink-0  text-gray-400" />

            <input
              type="text"
              placeholder="Search"
              className="flex-1 outline-none p-2"
              value={searchString}
              onChange={(e) => setSearchString(e.target.value)}
            />
            <button type="submit" hidden>
              Search
            </button>
          </form>

          {/* avatar */}
          <Avatar name="Ahmed Ayman" round color="#0055d1" size="40" />
        </div>
      </div>

      <div className="flex items-center justify-center px-5 my-2 md:my-5">
        <p
          className="flex items-start md:items-center gap-2  text-sm font-light  pr-5 bg-white 
          shadow-xl italic rounded-xl p-2 w-fit text-[#0055d1]"
        >
          <UserCircleIcon
            className={`inline-block h-8 w-8 shrink-0 text-[#0055d1] mr-1 ${
              loading && "animate-spin"
            }`}
          />

          {!loading && suggestion
            ? suggestion
            : " GPT is summarising your tasks for the day..."}
        </p>
      </div>
    </header>
  );
}

export default Header;
