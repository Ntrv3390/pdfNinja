import { authMiddleware } from "@kinde-oss/kinde-auth-nextjs/server"

export const config = {
    matcher: ["/dashboard/:path*", "/auth-callback"],
}
// added middleware
export default authMiddleware;