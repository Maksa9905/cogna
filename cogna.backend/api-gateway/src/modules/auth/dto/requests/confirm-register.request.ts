import { Field, InputType } from '@nestjs/graphql';
import { ConfirmRegisterRequest } from '@cogna-edu/contracts/gen/auth/auth';

@InputType()
export class ConfirmRegisterRequestGql implements ConfirmRegisterRequest {
  @Field()
  email: string;

  @Field()
  otp: number;
}
