import { trpc } from "@/app/_trpc/client";
import { useRouter, useSearchParams } from "next/navigation";

const Page = async () => {
  const router = useRouter();

  const searchParams = useSearchParams();
  const origin = searchParams.get("origin");

  const { data, isLoading } = trpc.authCallback.useQuery(undefined, {
    onSuccess: ({ success }) => {
      if (success) {
        //user synced into the database
        router.push(origin ? `/${origin}` : `/dashboard`);
      }
    },
  });
};

export default Page;
