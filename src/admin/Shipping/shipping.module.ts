import { Module } from '@nestjs/common';
import { ShippingResolver, ShippingTypesResolver, SlotResolver } from './shipping.resolvers';

const declarations = [
  ShippingResolver,
  SlotResolver,
  ShippingTypesResolver,
];

@Module({
  providers: declarations,
  exports: declarations,
})
export class ShippingAdminModule { }
