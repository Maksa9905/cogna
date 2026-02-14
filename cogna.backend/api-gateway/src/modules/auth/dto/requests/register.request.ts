import { Field, InputType } from '@nestjs/graphql';
import { RegisterRequest } from '@cogna-edu/contracts/gen/auth';

@InputType()
export class RegisterRequestGql implements RegisterRequest {
  @Field()
  email: string;

  @Field()
  password: string;
}
