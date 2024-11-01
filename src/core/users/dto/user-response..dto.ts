import { Role, Gender } from '../../common/enums';

export class ResponseUsersDto {
  id: number;
  email: string;
  // password: string; // Do not return password
  role: Role;
  username: string;
  first_name: string;
  last_name: string;
  gender: Gender;
  active: boolean;
  created_at: string;
  updated_at: string;
  //   created_by: number; // Do not return created_by
  //   updated_by: number;  // Do not return updated_by
}
