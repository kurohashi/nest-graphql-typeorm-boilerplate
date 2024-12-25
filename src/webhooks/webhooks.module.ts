import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderController, PaymentsController } from 'src/customer/Payment/payment.resolvers';

const declarations = [
    PaymentsController,
    OrderController
];

@Module({
    imports: [
        TypeOrmModule.forFeature(declarations),
    ],
    controllers: declarations,
})
export class WebhooksModule {}