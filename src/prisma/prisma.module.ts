import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PrismaController } from './prisma.controller';

@Module({
  imports: [],
  controllers: [PrismaController],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
