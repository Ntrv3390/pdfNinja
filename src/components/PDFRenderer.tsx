"use client";

import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Loader2,
  RotateCw,
  Search,
  X,
} from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useToast } from "./ui/use-toast";
import { useResizeDetector } from "react-resize-detector";
import { Button, buttonVariants } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import SimpleBar from "simplebar-react";
import PdfFullScreen from "./PdfFullScreen";
import Link from "next/link";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface PdfRendererProps {
  url: string;
}

const PDFRenderer = ({ url }: PdfRendererProps) => {
  const { toast } = useToast();

  const [numPages, setNumPages] = useState<number>();

  const [scale, setScale] = useState<number>(1);

  const [rotation, setRotation] = useState<number>(0);
  const [renderedScale, setRenderedScale] = useState<number | null>(null);
  const [noteVisible, setNoteVisible] = useState<boolean | true>(true);
  const isLoading = renderedScale !== scale;

  const CustomPageValidator = z.object({
    page: z
      .string()
      .refine((num) => Number(num) > 0 && Number(num) <= numPages!),
  });
  type TCustomPageValidator = z.infer<typeof CustomPageValidator>;
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<TCustomPageValidator>({
    defaultValues: {
      page: "1",
    },
    resolver: zodResolver(CustomPageValidator),
  });

  const { width, ref } = useResizeDetector();
  const [currPage, setCurrPage] = useState<number>(1);

  const handlePageSubmit = ({ page }: TCustomPageValidator) => {
    setCurrPage(Number(page));
    setValue("page", String(page));
  };

  const handleNoteVisibility = () => {
    setNoteVisible(false);
  };

  return (
    <>
      {noteVisible && (
        <div className="mb-5 p-5 text-white flex flex-row-reverse bg-red-600 rounded-md">
          <X
            className="absolute cursor-pointer top-[87px] left-[825px]"
            width={20}
            height={20}
            onClick={handleNoteVisibility}
          />
          <p>
            My OpenAI API quota has been exceeded, so the model will not be able
            to respond to your questions. Thank you for your visit.
          </p>
        </div>
      )}
      <div className="w-full bg-white rounded-md shadow flex flex-col items-center">
        <div className="h-14 w-full border-b border-zinc-200 flex items-center justify-between px-2">
          <div className="flex items-center gap-1.5">
            <Link
              className={buttonVariants({
                variant: "ghost",
              })}
              href="/dashboard"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <Button
              disabled={currPage <= 1}
              variant="ghost"
              aria-label="previous page"
              onClick={() => {
                setCurrPage((prev) => (prev - 1 > 1 ? prev - 1 : 1));
                setValue("page", String(currPage - 1));
              }}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-1.5">
              <Input
                {...register("page")}
                className={cn(
                  "w-12 h-8",
                  errors.page && "focus-visible:ring-red-500"
                )}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSubmit(handlePageSubmit)();
                  }
                }}
              />
              <p className="text-zinc-700 text-sm space-x-1">
                <span>/</span>
                <span>{numPages ?? "?"}</span>
              </p>
            </div>

            <Button
              disabled={numPages === undefined || currPage === numPages}
              variant="ghost"
              aria-label="next page"
              onClick={() => {
                setCurrPage((prev) =>
                  prev + 1 > numPages! ? numPages! : prev + 1
                );
                setValue("page", String(currPage + 1));
              }}
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button aria-label="zoom" className="gap-1.5" variant="ghost">
                  <Search className="h-4 w-4" />
                  {scale * 100}%<ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onSelect={() => setScale(1)}>
                  100%
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setScale(1.5)}>
                  150%
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setScale(2)}>
                  200%
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setScale(2.5)}>
                  250%
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              onClick={() => setRotation((prev) => prev + 90)}
              variant="ghost"
              aria-label="rotate"
            >
              <RotateCw className="h-4 w-4" />
            </Button>

            <PdfFullScreen fileUrl={url} />
          </div>
        </div>

        <div className="flex-1 w-full max-h-screen">
          <SimpleBar autoHide={false} className="max-h-[calc(100vh-10rem)]">
            <div ref={ref}>
              <Document
                onLoadSuccess={({ numPages }) => {
                  setNumPages(numPages);
                }}
                loading={
                  <div className="flex justify-center">
                    <Loader2 className="my-24 h-6 w-6 animate-spin" />
                  </div>
                }
                onLoadError={() => {
                  toast({
                    title: "Error loading pdf",
                    description: "Please try again later",
                    variant: "destructive",
                  });
                }}
                file={url}
                className="max-h-full"
              >
                {isLoading && renderedScale ? (
                  <Page
                    key={"@" + renderedScale}
                    pageNumber={currPage}
                    width={width ? width : 1}
                    scale={scale}
                    rotate={rotation}
                  />
                ) : null}
                <Page
                  key={"@" + scale}
                  loading={
                    <div className="flex justify-center">
                      <Loader2 className="my-24 h-6 w-6 animate-spin" />
                    </div>
                  }
                  onRenderSuccess={() => {
                    setRenderedScale(scale);
                  }}
                  className={cn(isLoading ? "hidden" : "")}
                  pageNumber={currPage}
                  width={width ? width : 1}
                  scale={scale}
                  rotate={rotation}
                />
              </Document>
            </div>
          </SimpleBar>
        </div>
      </div>
    </>
  );
};

export default PDFRenderer;
