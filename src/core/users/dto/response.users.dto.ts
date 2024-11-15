import { Role, Gender } from '../../common/enums';

export class ResponseUsersDto {
  id: number;
  email: string;
  role: Role;
  username: string;
  first_name: string;
  last_name: string;
  gender: Gender;
  active?: boolean;
  created_at?: string;
  updated_at?: string;
}
