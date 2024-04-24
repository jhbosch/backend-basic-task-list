import { ApiProperty } from '@nestjs/swagger';
import { ITask } from '../task.interface';

export class GetTasksResponseDto {
  @ApiProperty({ example: 'task_search_success' })
  message: string;
  @ApiProperty({
    example: {
      tasks: [
        {
          description: 'test task description',
          id: '5d987c3bfb881ec86b476bcc',
        },
      ],
    },
    nullable: true,
  })
  data: {
    tasks: ITask[];
  };
  @ApiProperty({ example: 'null' })
  errors: { [key: string]: any };
}
