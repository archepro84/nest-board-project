import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { EmailModule } from './email/email.module';
import { ConfigModule, ConfigModuleOptions } from '@nestjs/config';
import { validationSchema } from './config/validationSchema';
import emailConfig from './config/emailConfig';

const configModuleOption: ConfigModuleOptions = {
  envFilePath: [`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],
  load: [emailConfig],
  isGlobal: true,
  validationSchema,
};

@Module({
  imports: [ConfigModule.forRoot(configModuleOption), UsersModule, EmailModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
