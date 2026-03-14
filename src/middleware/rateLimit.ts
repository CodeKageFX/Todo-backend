import rateLimit from "express-rate-limit";

// General API rate limit — 100 requests per 15 minutes
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        error: "Too many request, pls try again later"
    },
    standardHeaders: true, // Return rate limit info in headers
    legacyHeaders: false
})

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        error:"Too many attempts, try again later"
    },
    standardHeaders: true,
    legacyHeaders: false
})