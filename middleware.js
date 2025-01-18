import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define protected and public routes
const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/forum(.*)']);
const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)']);

export default clerkMiddleware(async (auth, req) => {
    // If the route is protected, apply auth protection
    if (isProtectedRoute(req)) {
        await auth.protect();
    }
    // If it's a public route (sign-in/sign-up), do nothing
});

// Configure middleware to handle specific routes
export const config = {
    matcher: [
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        '/(api|trpc)(.*)',
    ],
};
