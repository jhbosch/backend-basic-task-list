import { Module } from '@nestjs/common';
import { ClientProxyFactory } from '@nestjs/microservices';
import { TasksController } from './tasks.controller';

import { ConfigService } from './services/config/config.service';

@Module({
  imports: [],
  controllers: [TasksController],
  providers: [
    ConfigService,
    {
      provide: 'TASK_SERVICE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create(configService.get('taskService'));
      },
      inject: [ConfigService],
    },
  ],
})
export class AppModule {}
