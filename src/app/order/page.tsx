"use client";

import TopNevbar from "@/component/TopNevbar";
import Header from "@/component/Header";
import OrderPlatforms from "@/component/OrderPlace";

export default function OrderPage() {

  return (
    <div className=" min-h-screen max-w-full bg-linear-to-br from-[#1B4D3E] to-[#2C7A63] relative">

      {/* top header */}
      <div className="fixed z-30 left-0 right-0 px-2 ">
         <TopNevbar />
      </div>
      
      {/* order now--- */} 
           <OrderPlatforms/>
  
      {/* mobile navbar  */}
      <div className="fixed z-30 left-0 right-0 bottom-0 bg-white p-1">
        <Header/>
      </div>
      
    </div>
  );
}

