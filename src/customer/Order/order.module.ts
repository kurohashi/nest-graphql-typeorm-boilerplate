import { Module } from '@nestjs/common';
import { OrderTrackingResolver, OrderResolver, ItemResolver, TaxBreakUpResolver} from './order.resolvers';

@Module({
  providers: [
    OrderTrackingResolver,
    OrderResolver,
    ItemResolver,
    TaxBreakUpResolver
  ],
  exports: [
    OrderTrackingResolver,
    OrderResolver,
    ItemResolver,
    TaxBreakUpResolver
  ]
})
export class OrderUserModule {}
