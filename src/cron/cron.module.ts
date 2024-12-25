import { Module } from '@nestjs/common';
import { TasksService, WarehouseSyncService } from './crons.resolvers';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../admin/Product/product.models';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product])
  ],
  providers: [TasksService,WarehouseSyncService]
})
export class TasksModule {}
