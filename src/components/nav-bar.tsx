"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const path = usePathname();

  return (
    <nav className="border-gray-200 bg-white px-2 py-2.5 dark:bg-amber-200 sm:px-4">
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
        <button
          data-collapse-toggle="navbar-default"
          type="button"
          className="ml-3 inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-amber-600 md:hidden"
          aria-controls="navbar-default"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="h-6 w-6"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </button>
        <div className="hidden w-full md:block md:w-auto" id="navbar-default">
          <ul className="mt-4 flex flex-col rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-amber-300 dark:bg-amber-300 md:mt-0 md:flex-row md:space-x-8 md:border-0 md:bg-white md:text-sm md:font-medium md:dark:bg-amber-200">
            <li>
              <Link
                href="/"
                className="block rounded py-2 pl-3 pr-4 text-gray-700 hover:bg-pri dark:text-black dark:hover:bg-pri dark:hover:text-white md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:bg-transparent md:dark:hover:text-pri"
                aria-current="page"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/jobs"
                className="block rounded py-2 pl-3 pr-4 text-gray-700 hover:bg-pri dark:text-black dark:hover:bg-pri dark:hover:text-white md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:bg-transparent md:dark:hover:text-pri"
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
