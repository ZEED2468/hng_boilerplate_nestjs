import { Test, TestingModule } from '@nestjs/testing';
import { RegionsService } from './regions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Region } from './entities/region.entity';
import { CreateRegionDto, UpdateRegionDto } from './dto/create-region.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

const mockRegionRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
};

describe('RegionsService', () => {
  let service: RegionsService;
  let repository: Repository<Region>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegionsService,
        {
          provide: getRepositoryToken(Region),
          useValue: mockRegionRepository,
        },
      ],
    }).compile();

    service = module.get<RegionsService>(RegionsService);
    repository = module.get<Repository<Region>>(getRepositoryToken(Region));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createRegion', () => {
    it('should successfully create a region', async () => {
      const createRegionDto: CreateRegionDto = {
        region: 'United States',
        description: 'USA',
      };

      const newRegion: Region = {
        id: 'some-id',
        region: 'United States',
        description: 'USA',
        created_at: new Date(),
        updated_at: new Date(),
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      jest.spyOn(repository, 'create').mockImplementation(
        dto =>
          ({
            ...dto,
            id: 'some-id',
            created_at: new Date(),
            updated_at: new Date(),
          }) as Region
      );
      jest.spyOn(repository, 'save').mockResolvedValue(newRegion);

      const result = await service.createRegion(createRegionDto);
      expect(result).toEqual({
        status_code: HttpStatus.CREATED,
        message: 'Region Created Successfully',
        region: {
          ...newRegion,
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
        },
      });
    });

    it('should handle region already exists', async () => {
      const createRegionDto: CreateRegionDto = {
        region: 'United States',
        description: 'USA',
      };

      const existingRegion: Region = {
        id: 'some-id',
        region: 'United States',
        description: 'USA',
        created_at: new Date(),
        updated_at: new Date(),
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(existingRegion);

      await expect(service.createRegion(createRegionDto)).rejects.toThrow(
        new HttpException(
          {
            status_code: HttpStatus.CONFLICT,
            message: 'Region already exists',
          },
          HttpStatus.CONFLICT
        )
      );
    });

    it('should handle errors during creation', async () => {
      const createRegionDto: CreateRegionDto = {
        region: 'United States',
        description: 'USA',
      };

      jest.spyOn(repository, 'findOne').mockRejectedValue(new Error('Some error'));

      await expect(service.createRegion(createRegionDto)).rejects.toThrow(
        new HttpException(
          {
            message: 'An error occurred',
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
          id: '1',
          region: 'United States',
          description: 'USA',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: '2',
          region: 'Canada',
          description: 'Canada',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      jest.spyOn(repository, 'find').mockResolvedValue(regions);

      const result = await service.getSupportedRegions();
      expect(result).toEqual({
        status_code: HttpStatus.OK,
        message: 'Regions fetched successfully',
        regions: regions.map(r => ({
          region: `${r.region} (${r.description})`,
        })),
      });
    });

    it('should handle errors during fetch', async () => {
      jest.spyOn(repository, 'find').mockRejectedValue(
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

  describe('updateRegion', () => {
    it('should successfully update a region', async () => {
      const updateRegionDto: UpdateRegionDto = {
        region: 'United States',
        description: 'USA',
      };

      const existingRegion: Region = {
        id: 'some-id',
        region: 'United States',
        description: 'USA',
        created_at: new Date(),
        updated_at: new Date(),
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(existingRegion);
      jest.spyOn(repository, 'save').mockImplementation(
        async dto =>
          ({
            ...existingRegion,
            ...dto,
            updated_at: new Date(),
          }) as Region
      );

      const result = await service.updateRegion('some-id', updateRegionDto);
      expect(result).toEqual({
        status_code: HttpStatus.OK,
        message: 'Region successfully updated',
        region: {
          ...existingRegion,
          ...updateRegionDto,
          updated_at: expect.any(Date),
        },
      });
    });

    it('should handle region not found', async () => {
      const updateRegionDto: UpdateRegionDto = {
        region: 'United States',
        description: 'USA',
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.updateRegion('some-id', updateRegionDto)).rejects.toThrow(
        new HttpException(
          {
            status_code: HttpStatus.NOT_FOUND,
            message: 'Region not found',
          },
          HttpStatus.NOT_FOUND
        )
      );
    });

    it('should handle errors during update', async () => {
      const updateRegionDto: UpdateRegionDto = {
        region: 'United States',
        description: 'USA',
      };

      jest.spyOn(repository, 'findOne').mockRejectedValue(new Error('Test error'));

      await expect(service.updateRegion('some-id', updateRegionDto)).rejects.toThrow(
        new HttpException(
          {
            message: 'An error occurred',
            status_code: HttpStatus.INTERNAL_SERVER_ERROR,
          },
          HttpStatus.INTERNAL_SERVER_ERROR
        )
      );
    });
  });
});
