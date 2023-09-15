import { ConfigModule, ConfigService } from '@nestjs/config';
import { IRMQServiceAsyncOptions } from 'nestjs-rmq';

export const getRMQConfig = (): IRMQServiceAsyncOptions => ({
	inject: [ConfigService],
	imports: [ConfigModule],
	useFactory: (configService: ConfigService) => ({
		exchangeName: configService.getOrThrow('AMQP_EXCHANGE') ?? '',
		connections: [
			{
				login: configService.getOrThrow('AMQP_USER') ?? '',
				password: configService.getOrThrow('AMQP_PASSWORD') ?? '',
				host: configService.getOrThrow('AMQP_HOSTNAME') ?? ''
			}
		],
		queueName: configService.getOrThrow('AMQP_QUEUE'),
		prefetchCount: 32,
		serviceName: 'purple-account'
	})
})