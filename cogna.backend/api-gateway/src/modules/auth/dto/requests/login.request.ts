import { Field, InputType } from '@nestjs/graphql';
import { LoginRequest } from '@cogna-edu/contracts/gen/auth';

@InputType()
export class LoginRequestGql implements LoginRequest {
  @Field()
  email: string;

  @Field()
  password: string;
}
