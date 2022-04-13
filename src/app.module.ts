import { Module } from '@nestjs/common';
import { BlogModule } from './blog/blog.module';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [BlogModule, TypeOrmModule.forRoot()],
  controllers: [],
  providers: [],
})
export class AppModule { }
