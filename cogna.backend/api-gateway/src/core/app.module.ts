import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { AuthModule } from '../modules/auth/auth.module';
import { Request, Response } from 'express';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from '../common/strategies';
import { ContentModule } from '../modules/content/content.module';
import { ThesisModule } from '../modules/thesis/thesis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true,
      playground: false,
      includeStacktraceInErrorResponses: false,
      formatError: (error) => {
        return {
          message: error.message,
          details: (error.extensions?.message ||
            'Internal server error') as string,
          status: error.extensions?.status || '500',
        };
      },
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      context: ({ req, res }: { req: Request; res: Response }) => ({
        req,
        res,
      }),
    }),
    AuthModule,
    ContentModule,
    ThesisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
