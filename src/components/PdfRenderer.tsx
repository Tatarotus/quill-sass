"use client";
import { Document, Page, pdfjs } from "react-pdf";
import { useState } from "react";

import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import {
  ChevronDown,
  ChevronUp,
  Loader2,
  RotateCw,
  Search,
} from "lucide-react";
import { useToast } from "./ui/use-toast";
import { useResizeDetector } from "react-resize-detector";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";

import SimpleBar from "simplebar-react";
import PdfFullScreen from "@/components/PdfFullscreen";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

interface PdfRendererProps {
  url: string;
}

const PdfRenderer = ({ url }: PdfRendererProps) => {
  const { toast } = useToast();
  const [numPages, setNumPages] = useState<number>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1);
  const [rotation, setRotation] = useState(0);
  const [renderedScale, setRenderedScale] = useState<number | null>(null);

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
    getFieldState,
  } = useForm<TCustomPageValidator>({
    defaultValues: {
      page: "1",
    },
    resolver: zodResolver(CustomPageValidator),
  });

  const { width, ref } = useResizeDetector();

  const handlePageSubmit = ({ page }: TCustomPageValidator) => {
    console.log("I shall pass!");
    setCurrentPage(Number(page));
    setValue("page", String(page));
    // setValue("page", String(page || getFieldState("page")))
  };

  return (
    <div className="w-full bg-white rounded-md shadow flex flex-col items-center">
      <div className="h-14 w-full border-b border-zinc-200 flex items-center justify-between px-2">
        <div className="flex items-center gap-1.5">
          <Button
            disabled={currentPage === 1}
            onClick={() => {
              setCurrentPage((prev) => (prev - 1 > 1 ? prev - 1 : 1));
              setValue("page", String(currentPage - 1));
            }}
            variant="ghost"
            aria-label="previous page"
          >
            <ChevronDown className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-1.5">
            <Input
              {...register("page")}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit(handlePageSubmit)();
                }
              }}
              className={cn(
                "w-12 h-8 focus:font-bold",
                errors.page &&
                  " focus-visible:ring-red-500 font-light focus:font-light "
              )}
            />
            <p className="text-zinc-700 text-sm space-x-1">
              <span>/</span>{" "}
              <span className="text-zinc-500 ">{numPages ?? "x"}</span>
            </p>
          </div>
          <Button
            disabled={currentPage === undefined || currentPage === numPages}
            onClick={() => {
              setCurrentPage((prev) =>
                prev + 1 < numPages! ? prev + 1 : numPages!
              );
              setValue("page", String(currentPage + 1));
            }}
            variant="ghost"
            aria-label="next page"
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-x-2  justify-center flex items-center ">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-label="zoom" variant="ghost">
                <Search className="h-4 w-4 mr-1" />
                {scale * 100}% <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setScale(1)}>
                100%
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setScale(1.5)}>
                150%
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setScale(2)}>
                200%
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setScale(2.5)}>
                250%
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            aria-label="rotate 90 degrees"
            onClick={() => setRotation((prev: any) => prev + 90)}
            variant="ghost"
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
              loading={
                <div className="flex justify-center">
                  <Loader2 className="my-24 h-6 w-6 animate-spin" />
                </div>
              }
              onLoadSuccess={({ _pdfInfo }) => {
                setNumPages(_pdfInfo.numPages);
              }}
              onLoadError={() => {
                toast({
                  title: "error loading PDF",
                  description: "Please try again later",
                  variant: "destructive",
                });
              }}
              className="max-h-full"
              file={url}
            >
              {isLoading && renderedScale ? (
                <Page
                  width={width ? width : 1}
                  scale={scale}
                  pageNumber={currentPage}
                  key={"@" + renderedScale}
                  rotate={rotation}
                />
              ) : (
                <Page
                  className={cn(isLoading ? "hidden" : "")}
                  width={width ? width : 1}
                  scale={scale}
                  pageNumber={currentPage}
                  rotate={rotation}
                  key={"@" + scale}
                  loading={
                    <div className="flex justify-center">
                      <Loader2 className="my-24 h-6 w-6 animate-spin" />
                    </div>
                  }
                  onRenderSuccess={() => setRenderedScale(scale)}
                />
              )}
            </Document>
          </div>
        </SimpleBar>
      </div>
    </div>
  );
};

export default PdfRenderer;
