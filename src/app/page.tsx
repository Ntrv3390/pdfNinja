import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs/server";
import Footer from "@/components/Footer";

export default function Home() {
  const { getUser } = getKindeServerSession();
  const user = getUser();
  return (
    <>
      <MaxWidthWrapper className="mb-12 mt-28 sm:mt-40 flex flex-col items-center justify-center text-center">
        <div className="bg-red-600 text-white p-5 m-8 rounded-lg text-2xl">
          <b>Please note:</b> This project may or may not run, as this project is made using services like OpenAI API, Databases like Pinecone, Uploadthing, etc. If their API keys have exhausted, it might be possible that the project won&apos;t run.
        </div>
        <h1 className="max-w-4xl text-5xl font-bold md:text-6xl lg:text-7xl">
          Say hello to your{" "}
          <span className="text-orange-600">PDF&apos;s👋</span>
        </h1>
        <p className="mt-5 max-w-prose text-zinc-700 sm:text-lg">
          pdfNinja allows you to have conversations with any PDF document.
          Simply upload your file and start asking questions right away.
        </p>
        {user ? (
          <Link
            className={buttonVariants({
              size: "lg",
              className: "mt-5",
            })}
            href="/dashboard"
          >
            Go to dashboard <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        ) : (
          <RegisterLink
            className={buttonVariants({
              size: "lg",
              className: "mt-5",
            })}
          >
            Get started <ArrowRight className="ml-1.5 h-5 w-5" />
          </RegisterLink>
        )}

        {/* Feature section */}

        <div className="mx-auto mb-3 mt-20 max-w-5xl sm:mt-56">
          <div className="mb-12 px-6 lg:px-8">
            <div className="mx-auto max-w-2xl sm:text-center">
              <h2 className="mt-2 font-bold text-4xl text-gray-900 sm:text-5xl">
                100% FREE to get Started.
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Don&apos;t worry we do not require your credit card😄
              </p>
            </div>
          </div>
        </div>

        {/* steps */}
        <ol className="my-8 space-y-4 pt-8 md:flex md:space-x-8 md:space-y-0">
          <li className="md:flex-1">
            <div className="flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pt-4">
              <span className="text-sm font-medium text-orange-600">
                Step 1
              </span>
              <span className="text-xl font-semibold">
                Sign up for an account
              </span>
            </div>
          </li>
          <li className="md:flex-1">
            <div className="flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pt-4">
              <span className="text-sm font-medium text-orange-600">
                Step 2
              </span>
              <span className="text-xl font-semibold">
                Upload your PDF file.
              </span>
            </div>
          </li>
          <li className="md:flex-1">
            <div className="flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pt-4">
              <span className="text-sm font-medium text-orange-600">
                Step 3
              </span>
              <span className="text-xl font-semibold">
                Start asking questions.
              </span>
            </div>
          </li>
        </ol>
        {user ? (
          <Link
            className={buttonVariants({
              size: "lg",
              className: "mt-5",
            })}
            href="/dashboard"
          >
            Go to dashboard <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        ) : (
          <RegisterLink
            className={buttonVariants({
              size: "lg",
              className: "mt-5",
            })}
          >
            Get started <ArrowRight className="ml-1.5 h-5 w-5" />
          </RegisterLink>
        )}
      </MaxWidthWrapper>
      <Footer />
    </>
  );
}

export function generateMetadata({}) {
  return {
    title: "Chat with your documents with pdfNinja",
  };
}
