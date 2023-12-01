"use client"

import Link from "next/link";

const year = new Date().getFullYear();

const Footer = () => {
    return (
        <div id="footer" className='mt-[4rem] mb-[0.7rem] font-semibold h-[3rem] w-auto'>
            <p className='px-3 md:px-0 text-center text-gray-700'>Copyright &copy; {year} pdfNinja. A product by <Link href="https://avitize-digital.vercel.app" target="_blank"><strong>Avitize Digital</strong></Link>.</p>
        </div>
    );
}

export default Footer;
