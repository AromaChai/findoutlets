import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { FaCartShopping } from 'react-icons/fa6'

const TopNevbar = () => {
    return (
        <>
        <div className="flex justify-between items-center py-2">
           <Link href={'/'}> <Image src="/images/aromaChaiLogo.png" alt="aromaChaiLogo" width={500} height={500}
                className="sm:w-44 w-32   object-cover" /></Link>
            <div className="text-white/20 backdrop-blur-xl sm:p-3 p-2 rounded-lg bg-white/10 flex justify-center items-center">
                <div className="flex items-center justify-center gap-2">
                    <FaCartShopping className="text-lg text-white" />
                    <Link href={'https://outlet.aromachai.in/shop'} className="text-sm md:test-lg  text-white">Show now</Link>

                </div>
            </div>
        </div>
        </>
    )
}
export default TopNevbar
