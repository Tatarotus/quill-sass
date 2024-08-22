"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { trpc } from "@/app/_trpc/client";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const origin = searchParams.get("origin");

  const { data, isSuccess, error, isError } = trpc.authCallback.useQuery();
  useEffect(() => {
    if (isSuccess && data) {
      // user is synced to db
      router.push(origin ? `/${origin}` : "/dashboard");
    }

    if (isError) {
      if (error.message === "UNAUTHORIZED") {
        router.push("/sign-in");
      }
    }
  }, [origin, isSuccess, data, error, isError, router]);

  return (
    <div className="w-full mt-24 flex justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className=" h-8 w-8 animate-spin text-zinc-800" />
        <h3 className="font-semibold text-xl">Setting up your account...</h3>
        <p>You will be redirected as soon as your account is ready!</p>
      </div>
    </div>
  );
};

export default Page;
