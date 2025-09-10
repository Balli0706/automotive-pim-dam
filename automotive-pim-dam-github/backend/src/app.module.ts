import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BullModule } from '@nestjs/bull';

// Core modules
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';

// Business modules
import { ProductsModule } from './modules/products/products.module';
import { AssetsModule } from './modules/assets/assets.module';
import { WorkflowsModule } from './modules/workflows/workflows.module';
import { ExportsModule } from './modules/exports/exports.module';

// Integration modules
import { AIServicesModule } from './modules/ai-services/ai-services.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { SearchModule } from './modules/search/search.module';

// Common modules
import { HealthModule } from './modules/health/health.module';
import { LoggingModule } from './common/logging/logging.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // Scheduling
    ScheduleModule.forRoot(),

    // Event system
    EventEmitterModule.forRoot(),

    // Queue system
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD,
      },
    }),

    // Core modules
    DatabaseModule,
    LoggingModule,
    HealthModule,

    // Auth & Users
    AuthModule,
    UsersModule,

    // Business logic
    ProductsModule,
    AssetsModule,
    WorkflowsModule,
    ExportsModule,

    // Integrations
    AIServicesModule,
    NotificationsModule,
    SearchModule,
  ],
})
export class AppModule {}