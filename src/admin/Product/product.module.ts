import { Module } from '@nestjs/common';
import { TaxSlabAdminResolver, CategoryResolver, SubCategoryResolver, SSubCategoryResolver, ProductResolver, WarehouseProductResolver, CollectionReferenceResolver, WarehouseIdsResolver, CollectionWarehouseProductResolver, BasePricingResolver, UserSpecificPricingResolver, PincodeGroupResolver, PincodeResolver, WarehousePincodeGroupResolver } from './product.resolvers';

const declarations = [
  TaxSlabAdminResolver,
  CategoryResolver,
  SubCategoryResolver,
  SSubCategoryResolver,
  ProductResolver,
  WarehouseProductResolver,
  CollectionReferenceResolver,
  WarehouseIdsResolver,
  CollectionWarehouseProductResolver,
  BasePricingResolver,
  UserSpecificPricingResolver,
  PincodeGroupResolver,
  PincodeResolver,
  WarehousePincodeGroupResolver,
];

@Module({
  providers: declarations,
  exports: declarations,
})
export class ProductAdminModule { }
