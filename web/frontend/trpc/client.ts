import { createTRPCReact } from "@trpc/react";
import type { AppRouter } from "../../trpc";

export const trpc = createTRPCReact<AppRouter>();
