import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EdificiosService } from './edificios.service';
import { EdificiosController } from './edificios.controller';
import { Edificio } from './entities/edificio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Edificio])],
  controllers: [EdificiosController],
  providers: [EdificiosService],
})
export class EdificiosModule { }
