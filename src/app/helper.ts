import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export function redirectIfStatus200(status: number, router: AppRouterInstance, path: string) {
  if (status === 200) {
    router.push(path);
  }
}
