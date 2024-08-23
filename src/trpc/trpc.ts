import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { initTRPC, TRPCError } from "@trpc/server";

// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.create();

const isAuthed = t.middleware(async (opts) => {
  const { getUser } = getKindeServerSession(); // only able to get that while logged in thus private procedure
  const user = getUser();
  if (!user || !user.id) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return opts.next({
    ctx: {
      userId: user.id,
      user,
    },
  });
});
// Base router and procedure helpers
export const router = t.router;
// export const procedure = t.procedure;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuthed);
