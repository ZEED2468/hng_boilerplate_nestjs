import { Test, TestingModule } from '@nestjs/testing';
import { RegionsController } from './regions.controller';
import { RegionsService } from './regions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Region } from './entities/region.entity';
import { CreateRegionDto } from './dto/create-region.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

const mockRegionRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
};

const mockRegionsService = {
  createRegion: jest.fn(),
  getSupportedRegions: jest.fn(),
};

describe('RegionsController', () => {
  let controller: RegionsController;
  let service: RegionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegionsController],
      providers: [
        {
          provide: RegionsService,
          useValue: mockRegionsService,
        },
        {
          provide: getRepositoryToken(Region),
          useValue: mockRegionRepository,
        },
      ],
    }).compile();

    controller = module.get<RegionsController>(RegionsController);
    service = module.get<RegionsService>(RegionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createRegion', () => {
    it('should successfully create a region', async () => {
      const createRegionDto: CreateRegionDto = {
        region: 'United States',
        description: 'USA',
      };

      const newRegion = { ...createRegionDto, id: 'some-id' };

      mockRegionsService.createRegion.mockResolvedValue({
        status_code: HttpStatus.CREATED,
        message: 'Region Created Successfully',
        region: newRegion,
      });

      const result = await service.createRegion(createRegionDto);
      expect(result).toEqual({
        status_code: HttpStatus.CREATED,
        message: 'Region Created Successfully',
        region: newRegion,
      });
    });

    it('should handle region already exists', async () => {
      const createRegionDto: CreateRegionDto = {
        region: 'United States',
        description: 'USA',
      };

      mockRegionsService.createRegion.mockResolvedValue({
        status_code: HttpStatus.CONFLICT,
        message: 'Region already exists',
      });

      const result = await service.createRegion(createRegionDto);
      expect(result).toEqual({
        status_code: HttpStatus.CONFLICT,
        message: 'Region already exists',
      });
    });

    it('should handle errors during creation', async () => {
      const createRegionDto: CreateRegionDto = {
        region: 'United States',
        description: 'USA',
      };

      mockRegionsService.createRegion.mockRejectedValue(
        new HttpException(
          {
            message: 'Error Occurred Performing this request',
            status_code: HttpStatus.INTERNAL_SERVER_ERROR,
          },
          HttpStatus.INTERNAL_SERVER_ERROR
        )
      );

      await expect(service.createRegion(createRegionDto)).rejects.toThrow(
        new HttpException(
          {
            message: 'Error Occurred Performing this request',
            status_code: HttpStatus.INTERNAL_SERVER_ERROR,
          },
          HttpStatus.INTERNAL_SERVER_ERROR
        )
      );
    });
  });

  describe('getSupportedRegions', () => {
    it('should return a list of regions', async () => {
      const regions: Region[] = [
        {
          region: 'United States',
          description: 'USA',
          created_at: new Date(),
          updated_at: new Date(),
          id: '',
        },
        {
          region: 'Canada',
          description: 'Canada',
          created_at: new Date(),
          updated_at: new Date(),
          id: '',
        },
      ];

      mockRegionsService.getSupportedRegions.mockResolvedValue({
        status_code: HttpStatus.OK,
        message: 'Regions fetched successfully',
        regions,
      });

      const result = await service.getSupportedRegions();
      expect(result).toEqual({
        status_code: HttpStatus.OK,
        message: 'Regions fetched successfully',
        regions,
      });
    });

    it('should handle errors during fetch', async () => {
      mockRegionsService.getSupportedRegions.mockRejectedValue(
        new HttpException(
          {
            message: 'Error Occurred while fetching regions',
            status_code: HttpStatus.INTERNAL_SERVER_ERROR,
          },
          HttpStatus.INTERNAL_SERVER_ERROR
        )
      );

      await expect(service.getSupportedRegions()).rejects.toThrow(
        new HttpException(
          {
            message: 'Error Occurred while fetching regions',
            status_code: HttpStatus.INTERNAL_SERVER_ERROR,
          },
          HttpStatus.INTERNAL_SERVER_ERROR
        )
      );
    });
  });
});
