import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Region } from './entities/region.entity';
import { CreateRegionDto, UpdateRegionDto } from './dto/create-region.dto';

@Injectable()
export class RegionsService {
  constructor(
    @InjectRepository(Region)
    private readonly regionRepository: Repository<Region>
  ) {}

  async createRegion(createRegionDto: CreateRegionDto): Promise<any> {
    try {
      const regionExists = await this.regionRepository.findOne({
        where: { region: createRegionDto.region },
      });

      if (regionExists) {
        throw new ConflictException({
          status_code: HttpStatus.CONFLICT,
          message: 'Region already exists',
        });
      }

      const newRegion = this.regionRepository.create(createRegionDto);
      await this.regionRepository.save(newRegion);

      return {
        status_code: HttpStatus.CREATED,
        message: 'Region Created Successfully',
        region: newRegion,
      };
    } catch (error) {
      Logger.error('RegionsServiceError ~ createRegion ~', error);
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException({
        message: 'An error occurred',
        status_code: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getSupportedRegions(): Promise<any> {
    try {
      const regions = await this.regionRepository.find();
      const formattedRegions = regions.map(region => ({
        region: `${region.region} (${region.description})`,
      }));
      return {
        status_code: HttpStatus.OK,
        message: 'Regions fetched successfully',
        regions: formattedRegions,
      };
    } catch (error) {
      Logger.error('RegionsServiceError ~ fetchRegions ~', error);
      throw new InternalServerErrorException({
        message: 'Error Occurred while fetching regions',
        status_code: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async updateRegion(id: string, updateRegionDto: UpdateRegionDto): Promise<any> {
    try {
      const region = await this.regionRepository.findOne({ where: { id } });
      if (!region) {
        throw new NotFoundException({
          status_code: HttpStatus.NOT_FOUND,
          message: 'Region not found',
        });
      }

      Object.assign(region, updateRegionDto);
      await this.regionRepository.save(region);

      return {
        status_code: HttpStatus.OK,
        message: 'Region successfully updated',
        region,
      };
    } catch (error) {
      Logger.error('RegionsServiceError ~ updateRegion ~', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException({
        message: 'An error occurred',
        status_code: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
