import Dashboard from "@/components/Dashboard";
import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

const Page = async () => {
  const { getUser } = getKindeServerSession();
  const user = getUser();
<<<<<<< HEAD
  console.log("user", user);
=======
>>>>>>> aeb3dfd1d9621167db90a6a11fc7b3a7450f328c

  if (!user || !user.id) redirect("/auth-callback?origin=dashboard");

  const dbUser = await db.user.findFirst({
    where: {
      id: user.id,
    },
  });

  if (!dbUser) redirect("/auth-callback?origin=dashboard");

  return <Dashboard />;
};

<<<<<<< HEAD
export default Page;
=======
export default Dashboard;
>>>>>>> aeb3dfd1d9621167db90a6a11fc7b3a7450f328c
