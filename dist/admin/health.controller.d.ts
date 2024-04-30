import { HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';
export declare class HealthController {
    #private;
    constructor(health: HealthCheckService, typeorm: TypeOrmHealthIndicator);
    live(): Promise<import("@nestjs/terminus").HealthCheckResult>;
    ready(): Promise<import("@nestjs/terminus").HealthCheckResult>;
}
