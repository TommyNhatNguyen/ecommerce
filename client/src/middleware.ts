import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
// 1. Specify protected and public routes
const protectedRoutes = [
  "/admin/dashboard",
  "/admin/inventory",
  "/admin/orders",
  "/admin/customers",
  "/admin/resources",
  "/admin/permissions",
];
const publicRoutes = ["/admin/login", "/admin/register", "/"];

export default async function middleware(req: NextRequest) {
  
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);
  const cookieStore = await cookies();
  const accessToken = JSON.parse(
    cookieStore.get("token")?.value || "{}",
  ).accessToken;
  // 4. Redirect to /login if the user is not authenticated
  if (isProtectedRoute && !accessToken && path.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/admin/login", req.nextUrl));
  }

  // 5. Redirect to /dashboard if the user is authenticated
  if (isPublicRoute && accessToken && path.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/admin", req.nextUrl));
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
