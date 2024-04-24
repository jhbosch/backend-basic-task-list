import { ITask } from './task.interface';

export interface IServiceTaskGetAllResponse {
  status: number;
  message: string;
  tasks: ITask[];
}
