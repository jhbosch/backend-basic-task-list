import { ApiProperty } from '@nestjs/swagger';
import { ITask } from '../task.interface';

export class UpdateTaskResponseDto {
  @ApiProperty({ example: 'task_update_by_id_success' })
  message: string;
  @ApiProperty({
    example: {
      task: {
        description: 'test task description',
        id: '5d987c3bfb881ec86b476bcc',
      },
    },
    nullable: true,
  })
  data: {
    task: ITask;
  };
  @ApiProperty({ example: null, nullable: true })
  errors: { [key: string]: any };
}
