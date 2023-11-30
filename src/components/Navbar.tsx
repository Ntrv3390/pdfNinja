import MaxWidthWrapper from "./MaxWidthWrapper";
import Link from "next/link";
import { LoginLink, RegisterLink, getKindeServerSession, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/server";
import { buttonVariants } from "./ui/button";
import { ArrowRight } from "lucide-react";

const Navbar = () => {
    const {getUser} = getKindeServerSession();
    const user = getUser();
    return(
        <nav className="sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
            <MaxWidthWrapper>
                <div className="flex h-14 items-center justify-between border-b border-zinc-200">
                    <Link href='/' className="flex z-40 font-semibold"><span>pdfNinja</span></Link>

                    <div className="hidden items-center space-x-4 sm:flex">
                        <>
                        <Link href="/pricing" className={buttonVariants({ variant: "ghost", size: "sm" })}>
      Pricing
    </Link>
                        {!user ? (
  <>
   
    <LoginLink className={buttonVariants({ variant: "ghost", size: "sm" })}>
      Sign in
    </LoginLink>
    <RegisterLink className={buttonVariants({ size: "sm" })}>
      Get started <ArrowRight className="ml-1.5 h-5 w-5" />
    </RegisterLink>
  </>
) : (
    <>
    
    <Link href="/dashboard" className={buttonVariants({ variant: "ghost", size: "sm" })}>
    Dashboard 
    </Link>
  <LogoutLink className={buttonVariants({ variant: "ghost", size: "sm" })}>
    Sign out
  </LogoutLink>
  <h4 className="text-zinc-700">Welcome <span className="font-semibold">
    {
      // @ts-ignore
      user.email.match(/^(.+)@/)[1]
    }
  </span>
  </h4>
  </>
)}

                            
                        </>
                    </div>
                </div>
            </MaxWidthWrapper>
        </nav>
    )
}

export default Navbar;