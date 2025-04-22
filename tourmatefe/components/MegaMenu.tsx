"use client";

import React from "react";
import Image from "next/image";
import Logo from "@/public/Logo.png";

import 'flowbite';
import Link from "next/link";

const MegaMenu = () => {
  return (
    <nav className="bg-white border-gray-200">
      <div className="flex flex-wrap items-center justify-between max-w-screen-xl mx-auto">
        <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <Image src={Logo} className="h-30 w-30" alt="Flowbite Logo" />
        </Link>
        <div className="flex items-center md:order-2 space-x-1 md:space-x-2 rtl:space-x-reverse">
          <a href="login" className="text-gray-800 hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-2 md:px-5 md:py-2.5 focus:outline-none">Login</a>
          <a href="signUp" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 md:px-5 md:py-2.5 focus:outline-none">Sign up</a>
          <button data-collapse-toggle="mega-menu-icons" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200" aria-controls="mega-menu-icons" aria-expanded="false">
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
            </svg>
          </button>
        </div>
        <div id="mega-menu-icons" className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1">
          <ul className="flex flex-col mt-4 font-medium md:flex-row md:mt-0 md:space-x-8 rtl:space-x-reverse">
            <li>
              <a href="#" className="block py-2 px-3 text-blue-600 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-600 md:p-0" aria-current="page">Trang chủ</a>
            </li>
            <li>
              <a href="#" className="block py-2 px-3 text-gray-900 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-600 md:p-0">Về chúng tôi</a>
            </li>
            <li>
              <a href="#" className="block py-2 px-3 text-gray-900 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-600 md:p-0">Tin tức</a>
            </li>
            <li>
              <button id="mega-menu-icons-dropdown-button" data-dropdown-toggle="mega-menu-icons-dropdown" className="flex items-center justify-between w-full py-2 px-3 font-medium text-gray-900 border-b border-gray-100 md:w-auto hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-600 md:p-0">
                Company
                <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                </svg>
              </button>
              <div id="mega-menu-icons-dropdown" className="absolute z-10 grid hidden w-auto grid-cols-2 text-sm bg-white border border-gray-100 rounded-lg shadow-md md:grid-cols-3">
                <div className="p-4 pb-0 text-gray-900 md:pb-4">
                  <ul className="space-y-4" aria-labelledby="mega-menu-icons-dropdown-button">
                    <li><a href="#" className="flex items-center text-gray-500 hover:text-blue-600 group">About Us</a></li>
                    <li><a href="#" className="flex items-center text-gray-500 hover:text-blue-600 group">Library</a></li>
                    <li><a href="#" className="flex items-center text-gray-500 hover:text-blue-600 group">Resources</a></li>
                    <li><a href="#" className="flex items-center text-gray-500 hover:text-blue-600 group">Pro Version</a></li>
                  </ul>
                </div>
                <div className="p-4 pb-0 text-gray-900 md:pb-4">
                  <ul className="space-y-4">
                    <li><a href="#" className="flex items-center text-gray-500 hover:text-blue-600 group">Blog</a></li>
                    <li><a href="#" className="flex items-center text-gray-500 hover:text-blue-600 group">Newsletter</a></li>
                    <li><a href="#" className="flex items-center text-gray-500 hover:text-blue-600 group">Playground</a></li>
                    <li><a href="#" className="flex items-center text-gray-500 hover:text-blue-600 group">License</a></li>
                  </ul>
                </div>
                <div className="p-4 text-gray-900">
                  <ul className="space-y-4">
                    <li><a href="#" className="flex items-center text-gray-500 hover:text-blue-600 group">Contact Us</a></li>
                    <li>
                                    <a href="#" className="flex items-center text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 group">
                                        <span className="sr-only">Support Center</span>
                                        <svg className="w-3 h-3 me-2 text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 21 21">
                                            <path d="m5.4 2.736 3.429 3.429A5.046 5.046 0 0 1 10.134 6c.356.01.71.06 1.056.147l3.41-3.412c.136-.133.287-.248.45-.344A9.889 9.889 0 0 0 10.269 1c-1.87-.041-3.713.44-5.322 1.392a2.3 2.3 0 0 1 .454.344Zm11.45 1.54-.126-.127a.5.5 0 0 0-.706 0l-2.932 2.932c.029.023.049.054.078.077.236.194.454.41.65.645.034.038.078.067.11.107l2.927-2.927a.5.5 0 0 0 0-.707Zm-2.931 9.81c-.024.03-.057.052-.081.082a4.963 4.963 0 0 1-.633.639c-.041.036-.072.083-.115.117l2.927 2.927a.5.5 0 0 0 .707 0l.127-.127a.5.5 0 0 0 0-.707l-2.932-2.931Zm-1.442-4.763a3.036 3.036 0 0 0-1.383-1.1l-.012-.007a2.955 2.955 0 0 0-1-.213H10a2.964 2.964 0 0 0-2.122.893c-.285.29-.509.634-.657 1.013l-.01.016a2.96 2.96 0 0 0-.21 1 2.99 2.99 0 0 0 .489 1.716c.009.014.022.026.032.04a3.04 3.04 0 0 0 1.384 1.1l.012.007c.318.129.657.2 1 .213.392.015.784-.05 1.15-.192.012-.005.02-.013.033-.018a3.011 3.011 0 0 0 1.676-1.7v-.007a2.89 2.89 0 0 0 0-2.207 2.868 2.868 0 0 0-.27-.515c-.007-.012-.02-.025-.03-.039Zm6.137-3.373a2.53 2.53 0 0 1-.35.447L14.84 9.823c.112.428.166.869.16 1.311-.01.356-.06.709-.147 1.054l3.413 3.412c.132.134.249.283.347.444A9.88 9.88 0 0 0 20 11.269a9.912 9.912 0 0 0-1.386-5.319ZM14.6 19.264l-3.421-3.421c-.385.1-.781.152-1.18.157h-.134c-.356-.01-.71-.06-1.056-.147l-3.41 3.412a2.503 2.503 0 0 1-.443.347A9.884 9.884 0 0 0 9.732 21H10a9.9 9.9 0 0 0 5.044-1.388 2.519 2.519 0 0 1-.444-.348ZM1.735 15.6l3.426-3.426a4.608 4.608 0 0 1-.013-2.367L1.735 6.4a2.507 2.507 0 0 1-.35-.447 9.889 9.889 0 0 0 0 10.1c.1-.164.217-.316.35-.453Zm5.101-.758a4.957 4.957 0 0 1-.651-.645c-.033-.038-.077-.067-.11-.107L3.15 17.017a.5.5 0 0 0 0 .707l.127.127a.5.5 0 0 0 .706 0l2.932-2.933c-.03-.018-.05-.053-.078-.076ZM6.08 7.914c.03-.037.07-.063.1-.1.183-.22.384-.423.6-.609.047-.04.082-.092.129-.13L3.983 4.149a.5.5 0 0 0-.707 0l-.127.127a.5.5 0 0 0 0 .707L6.08 7.914Z"/>
                                        </svg>
                                        Support Center
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="flex items-center text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 group">
                                        <span className="sr-only">Terms</span>
                                        <svg className="w-3 h-3 me-2 text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                                            <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z"/>
                                        </svg>
                                        Terms
                                    </a>
                                </li>
                  </ul>
                </div>
              </div>
            </li>
            <li>
              <a href="customer/aboutUs" className="block py-2 px-3 text-gray-900 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-600 md:p-0">Liên hệ</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default MegaMenu;
