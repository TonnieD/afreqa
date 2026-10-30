import PgBoss from "pg-boss";
declare global {
    var __afreqa_boss__: PgBoss | undefined;
}
export declare function getBossClient(): PgBoss;
export declare function getStartedBoss(): Promise<PgBoss>;
//# sourceMappingURL=client.d.ts.map