/**
 * Determines whether the local-development-only demo admin (`admin@afreqa.local`)
 * may be seeded. Strictly refuses when NODE_ENV === "production" or when
 * DATABASE_URL does not point to a local/Docker database host.
 */
export declare function isLocalDemoSeedAllowed(env: {
    NODE_ENV?: string;
    DATABASE_URL?: string;
}): boolean;
//# sourceMappingURL=seed-guard.d.ts.map