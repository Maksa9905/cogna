import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { AuthModule } from '../modules/auth/auth/auth.module';
import { Request, Response } from 'express';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from '../common/strategies';
import { ContentModule } from '../modules/content/content.module';
import { ThesisModule } from '../modules/thesis/thesis.module';
import { Module } from '@nestjs/common';
import { GraphQLUpload } from 'graphql-upload-ts';
import { AnswerModule } from '../modules/answer/answer.module';
import { UserModule } from '../modules/auth/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      csrfPrevention: {
        requestHeaders: ['apollo-require-preflight'],
      },
      // csrfPrevention: false,
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
      subscriptions: {
        'graphql-ws': {
          path: '/graphql',
        },
      },
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      context: ({ req, res, extra }) => {
        // Если есть extra, значит это WebSocket. Берем запрос из него.
        if (extra) {
          return { req: extra.request, res };
        }
        // Иначе это обычный HTTP
        return { req, res };
      },
    }),
    AuthModule,
    UserModule,
    ContentModule,
    ThesisModule,
    AnswerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
