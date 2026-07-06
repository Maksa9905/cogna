import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { AuthModule } from '../modules/auth/auth/auth.module';
import { Response } from 'express';
import { ConfigModule } from '@nestjs/config';
import { ContentModule } from '../modules/content/content.module';
import { ThesisModule } from '../modules/thesis/thesis.module';
import { Module } from '@nestjs/common';
import { AnswerModule } from '../modules/answer/answer.module';
import { UserModule } from '../modules/auth/user/user.module';
import { InfraModule } from '../common/infra/infra/infra.module';
import { StudyModule } from '../modules/study/study.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      // Interceptors (MetadataInterceptor → ALS) не вызываются на @ResolveField без этого.
      fieldResolverEnhancers: ['interceptors'],
      csrfPrevention: {
        requestHeaders: ['apollo-require-preflight'],
      },
      sortSchema: true,
      playground: false,
      includeStacktraceInErrorResponses: false,
      formatError: (error) => {
        return {
          message: error.message,
          details: (error.extensions?.details ||
            'Internal server error') as string,
          status: error.extensions?.status || '500',
        };
      },
      subscriptions: {
        'graphql-ws': {
          path: '/graphql',
          onConnect: (context: any) => {
            const connectionParams = context.connectionParams ?? {};
            const authorizationFromClient =
              (typeof connectionParams.Authorization === 'string' &&
                connectionParams.Authorization) ||
              (typeof connectionParams.authorization === 'string' &&
                connectionParams.authorization) ||
              '';
            if (authorizationFromClient && context.extra?.request?.headers) {
              context.extra.request.headers.authorization =
                authorizationFromClient.startsWith('Bearer ')
                  ? authorizationFromClient
                  : `Bearer ${authorizationFromClient}`;
            }
          },
        },
      },
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      context: ({ req, res, extra }) => {
        if (extra) {
          return { req: extra.request, res };
        }
        return { req, res };
      },
    }),
    AuthModule,
    UserModule,
    ContentModule,
    ThesisModule,
    AnswerModule,
    StudyModule,
    InfraModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
