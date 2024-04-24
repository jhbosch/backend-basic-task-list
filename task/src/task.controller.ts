import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { TaskService } from './services/task.service';
import { ITask } from './interfaces/task.interface';
import { ITaskUpdateParams } from './interfaces/task-update-params.interface';
import { ITaskSearchAllResponse } from './interfaces/task-search-by-user-response.interface';
import { ITaskDeleteResponse } from './interfaces/task-delete-response.interface';
import { ITaskCreateResponse } from './interfaces/task-create-response.interface';
import { ITaskUpdateByIdResponse } from './interfaces/task-update-by-id-response.interface';

@Controller()
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @MessagePattern('task_search_all')
  public async taskSearchAll(): Promise<ITaskSearchAllResponse> {
    const tasks = await this.taskService.getAllTasks();
    const result: ITaskSearchAllResponse = {
      status: HttpStatus.OK,
      message: 'task_search_all_success',
      tasks,
    };

    return result;
  }

  @MessagePattern('task_update_by_id')
  public async taskUpdateById(params: {
    task: ITaskUpdateParams;
    id: string;
  }): Promise<ITaskUpdateByIdResponse> {
    let result: ITaskUpdateByIdResponse;
    if (params.id) {
      try {
        const task = await this.taskService.findTaskById(params.id);
        if (task) {
          const updatedTask = Object.assign(task, params.task);
          await updatedTask.save();
          result = {
            status: HttpStatus.OK,
            message: 'task_update_by_id_success',
            task: updatedTask,
            errors: null,
          };
        } else {
          result = {
            status: HttpStatus.NOT_FOUND,
            message: 'task_update_by_id_not_found',
            task: null,
            errors: null,
          };
        }
      } catch (e) {
        result = {
          status: HttpStatus.PRECONDITION_FAILED,
          message: 'task_update_by_id_precondition_failed',
          task: null,
          errors: e.errors,
        };
      }
    } else {
      result = {
        status: HttpStatus.BAD_REQUEST,
        message: 'task_update_by_id_bad_request',
        task: null,
        errors: null,
      };
    }

    return result;
  }

  @MessagePattern('task_create')
  public async taskCreate(taskBody: ITask): Promise<ITaskCreateResponse> {
    let result: ITaskCreateResponse;

    if (taskBody) {
      try {
        const task = await this.taskService.createTask(taskBody);
        result = {
          status: HttpStatus.CREATED,
          message: 'task_create_success',
          task,
          errors: null,
        };
      } catch (e) {
        result = {
          status: HttpStatus.PRECONDITION_FAILED,
          message: 'task_create_precondition_failed',
          task: null,
          errors: e.errors,
        };
      }
    } else {
      result = {
        status: HttpStatus.BAD_REQUEST,
        message: 'task_create_bad_request',
        task: null,
        errors: null,
      };
    }

    return result;
  }

  @MessagePattern('task_delete_by_id')
  public async taskDeleteForUser(params: {
    id: string;
  }): Promise<ITaskDeleteResponse> {
    let result: ITaskDeleteResponse;

    if (params && params.id) {
      try {
        const task = await this.taskService.findTaskById(params.id);

        if (task) {
          await this.taskService.removeTaskById(params.id);
          result = {
            status: HttpStatus.OK,
            message: 'task_delete_by_id_success',
            errors: null,
          };
        } else {
          result = {
            status: HttpStatus.NOT_FOUND,
            message: 'task_delete_by_id_not_found',
            errors: null,
          };
        }
      } catch (e) {
        result = {
          status: HttpStatus.FORBIDDEN,
          message: 'task_delete_by_id_forbidden',
          errors: null,
        };
      }
    } else {
      result = {
        status: HttpStatus.BAD_REQUEST,
        message: 'task_delete_by_id_bad_request',
        errors: null,
      };
    }

    return result;
  }
}
