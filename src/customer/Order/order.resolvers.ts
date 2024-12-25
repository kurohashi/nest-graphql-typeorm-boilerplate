import { Args, Float, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { BaseResolver } from '../utils/base.resolver';
import { DataSource, FindManyOptions, In, Repository } from 'typeorm';
import { OrderTimeline, /* OrderItem ,*/ Order, Item, TaxBreakUp, ItemInput} from './order.models';
import { Cart, CartInlineItem } from '../Cart/cart.users.models';
import { WarehouseProduct } from 'src/admin/Product/product.models';
import { ZohoHelper } from "src/admin/utils/zoho.helper";



@Resolver()
export class OrderTrackingResolver extends BaseResolver(OrderTimeline) {
  constructor(dataSource: DataSource) {
    super(dataSource);
  }
}

@Resolver(() => Item)
export class ItemResolver extends BaseResolver(Item) {
  private zohohelper = new ZohoHelper();
  constructor(private dataSource: DataSource) {
    super(dataSource);
  }

  async createSalesOrder(@Args('user_id') user_id: string, @Args('address_id') address_id: string, @Args('warehouse_id') warehouse_id : string ): Promise<Order> {

   // Fetch cart and its inline items using the user_id and the address_id
   let cart = await this.dataSource.getRepository(Cart).findOne(
    { 
      where :{ customer_id : user_id, address_id: address_id, warehouse_id : warehouse_id },
      relations: ['items', 'items.productWarehouse', 'items.productWarehouse.product']
    });
    if (!cart) {
      throw new Error('Cart not found');
    }
    // find the products
    const productWarehouseIds = cart.items.map(item => item.warehouse_id);

     // Start a transaction
     return await this.dataSource.transaction(async (entityManager) => {
      // Create a new Order
      const order = new Order();
      for (let i in cart) {
        if (i in order) {
          order[i] = cart[i];
        }
      }
      order.user_id = cart.customer_id;
      order.total_amount = cart.total;
      order.zoho_contact_id = cart.zoho_contact_id;

      const savedOrder = await entityManager.save(Order, order);

      // Fetch WarehouseProduct entities based on productWarehouseIds
      const warehouseProducts = await entityManager.find(WarehouseProduct, {
        where: { id: In(productWarehouseIds) }
      });

      // Create Items from cart inline items and link to the new Order
      for (const inlineItem of cart.items) {
        // Find the corresponding warehouse product
        const warehouseProduct = warehouseProducts.find(wp => wp.id === inlineItem.warehouse_id);

        // Check if warehouse has sufficient quantity
        if (warehouseProduct.is_never_out_of_stock || (warehouseProduct.quantity >= inlineItem.quantity)) {
          const item = new Item();
          for (let i in inlineItem) {
            if (i in item) {
              item[i] = inlineItem[i];
            }
          }
          item.product_warehouse_id = inlineItem.warehouse_id;
          item.order_id = savedOrder.id;
          await entityManager.save(Item, item);

          if (!warehouseProduct.is_never_out_of_stock) {
            warehouseProduct.quantity -= inlineItem.quantity;
            await entityManager.save(WarehouseProduct, warehouseProduct);
          }

          // NOTE: what is to be done about the quantity of the products which will never go out of stock( a question to ankit )
        }
        // remove cartItem
        await entityManager.remove(CartInlineItem, inlineItem);
      }
      // remove cart
      await entityManager.remove(Cart, cart);  
      // save the order and return the data
      return savedOrder;
    });

    }

  }


@Resolver(() => Order)
export class OrderResolver extends BaseResolver(Order) {
  constructor(dataSource: DataSource) {
    super(dataSource);
  }

}


@Resolver()
export class TaxBreakUpResolver extends BaseResolver(TaxBreakUp) {
  constructor(dataSource: DataSource) {
    super(dataSource);
  }
}

/* 
@TODO
change the JWT to make sure the input are address_id , warehouse_id ,user_id , is_active and other mentioned in the whatsaap
*/