import { ITask } from './task.interface';

export interface ITaskSearchAllResponse {
  status: number;
  message: string;
  tasks: ITask[];
}
