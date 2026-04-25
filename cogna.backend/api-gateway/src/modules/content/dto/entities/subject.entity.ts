import { Field, ObjectType } from '@nestjs/graphql';
import { Subject } from '@cogna-edu/contracts/gen/content/subject';
import { TicketGql } from './ticket.entity';
import { SubjectProgressGql } from '../../../study/dto';

@ObjectType()
export class SubjectGql implements Subject {
  @Field()
  id: string;

  @Field()
  userId: string;

  @Field()
  title: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => [TicketGql])
  tickets: TicketGql[];

  @Field(() => SubjectProgressGql, { nullable: true })
  subjectProgress?: SubjectProgressGql;
}
