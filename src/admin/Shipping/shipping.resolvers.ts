import { Resolver } from "@nestjs/graphql";
import { DataSource } from "typeorm";
import { BaseAdminResolver } from "../utils/base.admin.resolver";
import { Slot, Shipping, ShippingTypes } from "./shipping.models";

@Resolver()
export class SlotResolver extends BaseAdminResolver(Slot) {
  constructor(dataSource: DataSource) {
    super(dataSource, true, undefined, undefined, true);
  }
}

@Resolver()
export class ShippingTypesResolver extends BaseAdminResolver(ShippingTypes) {
  constructor(dataSource: DataSource) {
    super(dataSource, true, undefined, undefined, true);
  }
}

@Resolver()
export class ShippingResolver extends BaseAdminResolver(Shipping){
  constructor(dataSource: DataSource) {
    super(dataSource, true, undefined, undefined, true);
  }
}