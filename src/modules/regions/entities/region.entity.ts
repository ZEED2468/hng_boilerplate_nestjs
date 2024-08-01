import { Entity, Column } from 'typeorm';
import { AbstractBaseEntity } from '../../../entities/base.entity';

@Entity()
export class Region extends AbstractBaseEntity {
  @Column({ unique: true })
  region: string;

  @Column()
  description: string;
}
