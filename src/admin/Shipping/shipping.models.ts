import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseModel } from '../utils/base.model';
import { Warehouse, PincodeGroup } from '../Product/product.models';
import { Outlet } from 'src/customer/Customer/customer.models';
import { Order } from 'src/customer/Order/order.models';



@Entity()
export class Slot extends BaseModel {

    @Column({ type: 'varchar' })
    slotName: string;

    @Column({ type: 'time' })
    startTime: string;

    @Column({ type: 'time' })
    endTime: string;

    @OneToMany(() => Shipping, foo => foo.slot)
    shippings: Shipping[];

    @OneToMany(() => Outlet, foo => foo.slot)
    outlets: Outlet[];
}

@Entity()
export class ShippingTypes extends BaseModel {
    @Column({ type: "text" })
    name: string;

    @Column({ type: "int" })
    defaultAmount: number;

    @OneToMany(() => Order, foo => foo.shipping_type)
    orders: Order[];
}

@Entity()
export class Shipping extends BaseModel {

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    orderValue: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    amount: number;

    @ManyToOne(() => Warehouse, foo => foo.id)
    @JoinColumn({ name: 'warehouse_id' }) // Foreign key for Warehouse
    warehouse: Warehouse;

    @Column({ type: 'uuid' })
    warehouse_id: string; // Assuming you're using string UUIDs

    @ManyToOne(() => Slot, foo => foo.id)
    @JoinColumn({ name: "slot_id" })
    slot: Slot;

    @Column({ type: "uuid", nullable: true })
    slot_id: string;

}


@Entity()
export class ShippingPincodeGroup extends BaseModel {
    @ManyToOne(() => PincodeGroup, group => group.id)
    @JoinColumn({ name: "group_id" })
    pincodeGroup: PincodeGroup;

    @Column({ type: "uuid" })
    group_id;

    @ManyToOne(() => Shipping, group => group.id)
    @JoinColumn({ name: "shipping_id" })
    shipping: Shipping;

    @Column({ type: "uuid" })
    shipping_id: string;
}