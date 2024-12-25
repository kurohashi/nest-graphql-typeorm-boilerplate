import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseModel } from '../utils/base.model';
import { Address, User } from 'src/customer/Customer/customer.models';
import {  WarehouseProduct } from '../../admin/Product/product.models';
import { ShippingTypes } from 'src/admin/Shipping/shipping.models';


@Entity()
export class Order extends BaseModel {

  @ManyToOne(() => User, user => user.id)
  user: User;

  @Column({ type: 'uuid', nullable: true })
  user_id: string;

  @OneToMany(() => Item, item => item.order)
  orderItems: Item[];

  @Column({ type: 'text', default: 'complete' })
  order_status: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total_amount: number;

  @Column({ type: 'varchar', length: 55, nullable: true })
  payment_mode: string;

  @Column({ type: 'varchar', length: 55, nullable: true })
  source: string;

  @Column({ type: 'varchar', length: 55, nullable: true })
  referrer: string;

  @Column({ type: 'text', nullable: true })
  delivery_instructions: string;

  @Column({ type: 'text', nullable: true })
  special_instructions: string;

  @Column({ type: 'text', nullable: true })
  discount_comment: string;

  @Column({ default: false, type: "boolean" })
  is_settled: boolean;

  @Column({ default: false, type: "boolean" })
  is_cancelled: boolean;

  @Column({ type: 'json', nullable: true })
  meta_data: any;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  calc_total_tax: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  calc_service_charge: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  calc_service_charge_tax: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  calc_delivery_charge_tax: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  calc_packaging_charge_tax: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  calc_total_item_discount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  calc_total_tcs: number;

  @Column({ type: 'decimal', precision: 10, scale: 3, default: 0 })
  complimentary: number;

  @Column({ type: 'decimal', precision: 10, scale: 3, default: 0 })
  tip: number;

  @Column({ type: 'json', nullable: true })
  cash_denomination: any;

  @ManyToOne(() => Address, address => address.id)
  @JoinColumn({ name: "address_id" })
  address: Address;

  @Column({ type: 'uuid', nullable: true })
  address_id: string;

  @ManyToOne(() => ShippingTypes, address => address.id)
  @JoinColumn({ name: "shipping_type_id" })
  shipping_type: ShippingTypes;

  @Column({ type: 'uuid', nullable: true })
  shipping_type_id: string;

  @OneToMany(() => OrderTimeline, status => status.order)
  statusTimeline: OrderTimeline[];

  @OneToMany(() => TaxBreakUp, taxBreakUp => taxBreakUp.order)
  taxBreakUps: TaxBreakUp[];

  @Column({ type: 'text', nullable: true })
  zoho_salesorder_id: string;

  @Column({ type: 'text', nullable: true })
  zoho_salesorder_number: string;

  @Column({ type: 'text', nullable: true })
  zoho_status: string;

  @Column({ type: 'int', default: 0})
  is_zoho_created: number;

  @Column({ type: 'int', default :0})
  attempts_to_create_on_zoho: number;

  @Column({ type: 'text', nullable: true})
  zoho_contact_id: string;
}

@Entity()
export class OrderTimeline extends BaseModel {

  @Column({ type: "text" })
  status: string; // status can be an enum like 'Placed', 'Processed', 'Shipped', 'Delivered', etc.

  @ManyToOne(() => Order, order => order.statusTimeline)
  order: Order;
}

@Entity()
export class Item extends BaseModel {

  @ManyToOne(() => WarehouseProduct)
  @JoinColumn({ name: 'product_warehouse_id' })
  productWarehouse: WarehouseProduct;
  @Column({ type: 'uuid' })
  product_warehouse_id: string;

  @ManyToOne(() => Order, order => order.orderItems)
  @JoinColumn({ name: 'order_id' })
  order: Order;
  @Column({ type: 'uuid' })
  order_id: string;

  @Column({ type: "text", default : ''})
  product_warehouse_name: string;

  @Column({ type: "text", default: ''})
  product_warehouse_description: string;

  @Column({ type: "uuid", nullable: true })
  warehouse_id: string;

  @Column({ type: 'text', default: '' })
  unit: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  final_price: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  total_price: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  item_level_discount: number;

  @Column({ type: 'decimal', precision: 12, scale: 3, default: 0 })
  quantity: number;

  @Column({ default: false, type: "boolean" })
  is_complimentary: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  complimentary_message: string;

  @Column({ default: false, type: "boolean" })
  is_discount_exempted: boolean;

  @Column({ default: false, type: "boolean" })
  is_tax_inclusive: boolean;

  @Column({ type: 'varchar', length: 55, nullable: true })
  group_name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  cancellation_message: string;

  @Column({ type: 'int', nullable: true })
  combo_id: number;

  @Column({ type: 'text', nullable: true })
  image_link: string;

  @Column({ type: 'int', nullable: true })
  invoice_number: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  calc_total_agg_tax: number;

  @Column({ type: 'decimal', precision: 4, scale: 2, default: 0 })
  calc_total_agg_tax_percent: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  calc_item_tax: number;

  @Column({ type: 'decimal', precision: 4, scale: 2, default: 0 })
  calc_item_tax_percent: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  calc_add_on_total: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, default: 0 })
  calc_item_discount_percentage: number;

  @Column({ type : 'text', nullable : true})
  item_id_zoho : string;
}


@Entity()
export class TaxBreakUp extends BaseModel {

  @Column({ type: 'varchar', length: 64, nullable: true })
  tax_name: string;

  @Column({ type: 'decimal', precision: 4, scale: 2 })
  tax_value: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  tax_amount: number;

  @ManyToOne(() => Order, order => order.taxBreakUps, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;
}


export interface ItemInput {
  name: string;
  final_price: number;
  total_price: number;
  item_level_discount: number;
  quantity: number;
  is_complimentary: boolean;
  complimentary_message?: string;
  is_discount_exempted: boolean;
  is_tax_inclusive: boolean;
  group_name?: string;
  cancellation_message?: string;
  combo_id?: number;
  image_link?: string;
  invoice_number?: number;
  calc_total_agg_tax: number;
  calc_total_agg_tax_percent: number;
  calc_item_tax: number;
  calc_item_tax_percent: number;
  calc_add_on_total: number;
  calc_item_discount_percentage: number;
}

