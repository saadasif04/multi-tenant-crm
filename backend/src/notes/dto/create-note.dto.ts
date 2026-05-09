import { IsString, IsInt } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  content!: string;

  @IsInt()
  customerId!: number;
}
