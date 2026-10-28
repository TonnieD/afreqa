export interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    resetInSeconds: number;
}
export declare function checkRateLimit(key: string, maxPoints: number, windowSeconds: number): Promise<RateLimitResult>;
//# sourceMappingURL=postgres-rate-limiter.d.ts.map