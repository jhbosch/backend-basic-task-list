import {
  Controller,
  Inject,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';

import { IServiceTaskCreateResponse } from './interfaces/task/service-task-create-response.interface';
import { IServiceTaskDeleteResponse } from './interfaces/task/service-task-delete-response.interface';
import { IServiceTaskGetAllResponse } from './interfaces/task/service-task-get-all-response.interface';
import { IServiceTaskUpdateByIdResponse } from './interfaces/task/service-task-update-by-id-response.interface';
import { GetTasksResponseDto } from './interfaces/task/dto/get-tasks-response.dto';
import { CreateTaskResponseDto } from './interfaces/task/dto/create-task-response.dto';
import { DeleteTaskResponseDto } from './interfaces/task/dto/delete-task-response.dto';
import { UpdateTaskResponseDto } from './interfaces/task/dto/update-task-response.dto';
import { CreateTaskDto } from './interfaces/task/dto/create-task.dto';
import { UpdateTaskDto } from './interfaces/task/dto/update-task.dto';
import { TaskIdDto } from './interfaces/task/dto/task-id.dto';

@Controller('tasks')
@ApiTags('tasks')
export class TasksController {
  constructor(
    @Inject('TASK_SERVICE') private readonly taskServiceClient: ClientProxy,
  ) {}

  @Get()
  @ApiOkResponse({
    type: GetTasksResponseDto,
    description: 'List of tasks for signed in user',
  })
  public async getTasks(): Promise<GetTasksResponseDto> {
    const tasksResponse: IServiceTaskGetAllResponse = await firstValueFrom(
      this.taskServiceClient.send('task_search_all', {}),
    );

    return {
      message: tasksResponse.message,
      data: {
        tasks: tasksResponse.tasks,
      },
      errors: null,
    };
  }

  @Post()
  @ApiCreatedResponse({
    type: CreateTaskResponseDto,
  })
  public async createTask(
    @Body() taskRequest: CreateTaskDto,
  ): Promise<CreateTaskResponseDto> {
    const createTaskResponse: IServiceTaskCreateResponse = await firstValueFrom(
      this.taskServiceClient.send('task_create', taskRequest),
    );

    if (createTaskResponse.status !== HttpStatus.CREATED) {
      throw new HttpException(
        {
          message: createTaskResponse.message,
          data: null,
          errors: createTaskResponse.errors,
        },
        createTaskResponse.status,
      );
    }

    return {
      message: createTaskResponse.message,
      data: {
        task: createTaskResponse.task,
      },
      errors: null,
    };
  }

  @Delete(':id')
  @ApiOkResponse({
    type: DeleteTaskResponseDto,
  })
  public async deleteTask(
    @Param() params: TaskIdDto,
  ): Promise<DeleteTaskResponseDto> {
    const deleteTaskResponse: IServiceTaskDeleteResponse = await firstValueFrom(
      this.taskServiceClient.send('task_delete_by_id', {
        id: params.id,
      }),
    );

    if (deleteTaskResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: deleteTaskResponse.message,
          errors: deleteTaskResponse.errors,
          data: null,
        },
        deleteTaskResponse.status,
      );
    }

    return {
      message: deleteTaskResponse.message,
      data: null,
      errors: null,
    };
  }

  @Put(':id')
  @ApiOkResponse({
    type: UpdateTaskResponseDto,
  })
  public async updateTask(
    @Param() params: TaskIdDto,
    @Body() taskRequest: UpdateTaskDto,
  ): Promise<UpdateTaskResponseDto> {
    const updateTaskResponse: IServiceTaskUpdateByIdResponse =
      await firstValueFrom(
        this.taskServiceClient.send('task_update_by_id', {
          id: params.id,
          task: taskRequest,
        }),
      );

    if (updateTaskResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: updateTaskResponse.message,
          errors: updateTaskResponse.errors,
          data: null,
        },
        updateTaskResponse.status,
      );
    }

    return {
      message: updateTaskResponse.message,
      data: {
        task: updateTaskResponse.task,
      },
      errors: null,
    };
  }
}
