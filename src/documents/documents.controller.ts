import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Request } from 'express';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @Roles('ADMIN', 'EDITOR')
  @UseGuards(RolesGuard)
  @UseInterceptors(FileInterceptor('file'))
  create(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    return this.documentsService.create(file, req.user.id);
  }

  @Get()
  findAll(@Req() req) {
    return this.documentsService.findAll(req.user);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    return this.documentsService.findOne(id, req.user);
  }

  @Patch(':id')
  @Roles('ADMIN', 'EDITOR')
  @UseGuards(RolesGuard)
  @UseInterceptors(FileInterceptor('file'))
  update(@Param('id', ParseIntPipe) id: number, @UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    return this.documentsService.update(id, file, req.user);
  }

  @Delete(':id')
  @Roles('ADMIN', 'EDITOR')
  @UseGuards(RolesGuard)
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    return this.documentsService.remove(id, req.user);
  }
}
