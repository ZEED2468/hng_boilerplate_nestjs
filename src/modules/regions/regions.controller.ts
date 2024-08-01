import { Controller, Get, Post, Body, Patch, Param, Res, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { CreateRegionDto, UpdateRegionDto } from './dto/create-region.dto';
import { RegionsService } from './regions.service';
import { Response } from 'express';

@ApiTags('Regions')
@Controller('regions')
export class RegionsController {
  constructor(private readonly regionsService: RegionsService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new region' })
  @ApiBody({ type: CreateRegionDto })
  @ApiResponse({ status: 201, description: 'Region successfully created.' })
  @ApiResponse({ status: 409, description: 'Region already exists.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createRegion(@Body() createRegionDto: CreateRegionDto) {
    return this.regionsService.createRegion(createRegionDto);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all supported regions' })
  @ApiResponse({ status: 200, description: 'List of supported regions.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getRegions(@Res() response: Response): Promise<any> {
    const result = await this.regionsService.getSupportedRegions();
    return response.status(result.status_code).json(result);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a region' })
  @ApiBody({ type: UpdateRegionDto })
  @ApiResponse({ status: 200, description: 'Region successfully updated.' })
  @ApiResponse({ status: 404, description: 'Region not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateRegion(@Param('id') id: string, @Body() updateRegionDto: UpdateRegionDto) {
    return this.regionsService.updateRegion(id, updateRegionDto);
  }
}
