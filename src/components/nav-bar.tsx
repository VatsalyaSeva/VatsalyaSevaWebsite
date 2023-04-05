"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const path = usePathname();
  // console.log(path)

  return (
    <nav className="border-gray-200 bg-white px-2 py-2.5  sm:px-4 py-4">
      <div className="container mx-auto flex flex-wrap items-center justify-between">
        <Link href="/" className="flex items-center">
          <img
            src="/logo.jpg"
            className="mr-3 h-10 rounded-full sm:h-9"
            alt="Flowbite Logo"
          />
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-black">
            Vatsalya Seva
          </span>
        </Link>
        
        <div className="" >
          <ul className="flex ">
            <li className={`group lg:px-5 px-3 py-3 rounded-lg ${path == '/' && `border-b-4 border-b-amber-200 rounded-none`}`}>
              <Link
                href="/"
                className="group-hover:font-bold"
                aria-current="page"
              >
                Home
              </Link>
            </li>
            <li className={`group  lg:px-5 px-3 py-3 rounded-lg ${path == '/jobs' && `border-b-4 border-b-amber-200 rounded-none`}`}>
              <Link
                href="/jobs"
                className="group-hover:font-bold"
              >
                Jobs
              </Link>
            </li>
            {/* <li>
              <a
                href="/event"
                className="block rounded py-2 pl-3 pr-4 text-gray-700 hover:bg-pri dark:text-black dark:hover:bg-pri dark:hover:text-white md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:bg-transparent md:dark:hover:text-pri"
              >
                Events
              </a>
            </li>
            
            <li>
              <a
                href="/contact"
                className="block rounded py-2 pl-3 pr-4 text-gray-700 hover:bg-pri dark:text-black dark:hover:bg-pri dark:hover:text-white md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:bg-transparent md:dark:hover:text-pri

"
              >
                Contact
              </a>
            </li> */}
          </ul>
        </div>
      </div>
    </nav>
  );
}
