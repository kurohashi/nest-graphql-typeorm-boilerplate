import { Args, Context, GraphQLExecutionContext, Info, Mutation, Resolver } from '@nestjs/graphql';
import { BaseResolver } from '../utils/base.resolver';
import { DataSource, FindManyOptions } from 'typeorm';
import { User, Outlet, Business, Address, Cuisine, OutletCuisines } from './customer.models';
import { ForbiddenException } from '@nestjs/common';
import { BaseAdminResolver } from 'src/admin/utils/base.admin.resolver';
import { GraphQLResolveInfo } from 'graphql';



@Resolver(() => User)
export class UserResolver extends BaseResolver(User) {
  constructor(dataSource: DataSource) {
    super(dataSource, true, new Set<string>(["password_hash"]));
  }

  async hasAddPermission(rows: User[], user?: User) {
    throw new ForbiddenException("Not allowed from here");
  }

  async hasUpdatePermission(currentObj: User, newObj: User, user?: User) {
    if (user.id != currentObj.id)
      throw new ForbiddenException("Cannot update different user's information");
    return newObj;
  }

}

@Resolver(() => Outlet)
export class OutletResolver extends BaseResolver(Outlet) {
  constructor(dataSource: DataSource) {
    super(dataSource);
  }
}

@Resolver(() => Cuisine)
export class CuisineResolver extends BaseAdminResolver(Cuisine) {
  constructor(public dataSource: DataSource) {
    super(dataSource, true, undefined, undefined, true);
  }

  @Mutation((returns) => Boolean, { name: `setCuisines` })
  public async setCuisines(
    @Args('rows') rows: Cuisine[],
    @Args('outlet_id') outlet_id: string,
    @Context() context?: GraphQLExecutionContext,
    @Info() info?: GraphQLResolveInfo,
  ) {
    const user = this.auth_required ? await this.getCurrentUser(context) : null;

    return await this.dataSource.transaction(async entityManager => {
      let foo = await entityManager.find(OutletCuisines, {
        where: { outlet_id }
      });
      if (foo && foo.length)
        await entityManager.remove(OutletCuisines, foo);

      await entityManager.save(OutletCuisines, rows.map(row => {
        return {
          outlet_id, cuisine_id: row.id
        };
      }));

      return true;
    });
  }
}


@Resolver(() => Business)
export class BusinessResolver extends BaseResolver(Business) {
  constructor(dataSource: DataSource) {
    super(dataSource, undefined, undefined, new Set<string>(["user_id", "user"]));
  }
}

@Resolver(() => Address)
export class AddressResolver extends BaseResolver(Address) {
  constructor(dataSource: DataSource) {
    super(dataSource, undefined, undefined, new Set<string>(["user_id", "user"]));
  }

  // @Mutation(() => Address)
  // async addInegratedAddress(@Args('row') row: Address): Promise<Address> {
  //   console.log("the code entered this line");
  //   // const pincode = { row };

  //   const newAddress = await this.dataSource.getRepository(Address).create(row);
  //   const saveAddress = await this.dataSource.getRepository(Address).save(newAddress);
   
  // //  const warehousePincodeRepository = this.dataSource.getRepository(WarehousePincode);
  // //  const warehousePincode = await warehousePincodeRepository.findOne({ 
  // //    where: { pincode: newAddress.postalcode }
  // //  });
   
  // //  if (!warehousePincode) {
  // //    return null;
  // //  }
   
  // //  const warehouseRepository = this.dataSource.getRepository(Warehouse);
  // //  const warehouse = await warehouseRepository.findOne({ 
  // //    where: { id: warehousePincode.warehouse_id }
  // //  });

  // //  saveAddress.warehouse_name = warehouse.warehouse_location;
  // //  saveAddress.warehouse_id = warehouse.id;  
  // //  saveAddress.warehouse_state_id = warehouse.state_id;

  // //  const statePincodeRepository = this.dataSource.getRepository(StatePincode);
  // //  const statePincode = await statePincodeRepository.findOne({ 
  // //    where: { pincode: newAddress.postalcode }
  // //  });
   
  // //  if (!statePincode) {
  // //    return null;
  // //  }
   
  // //  const stateRepository = this.dataSource.getRepository(State);
  // //  const state = await stateRepository.findOne({ 
  // //    where: { id: warehousePincode.warehouse_id }
  // //  });

  //  // saveAddress.state_name = state.state_name;
  //  // saveAddress.state_id = state.id;

  //   // await this.dataSource.getRepository(Address).save(saveAddress);

  //   return saveAddress;

  // }
}

