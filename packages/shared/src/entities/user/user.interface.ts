export class IUserEntity {
  _id: string;
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture: string;
  createdAt: string;
}

export interface IJwtPayload {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture: string;
}
