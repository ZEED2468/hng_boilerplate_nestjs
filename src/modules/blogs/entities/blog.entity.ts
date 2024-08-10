import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AbstractBaseEntity } from '../../../entities/base.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Blog extends AbstractBaseEntity {
  @Column({ nullable: false })
  title: string;

  @Column('text', { nullable: false })
  content: string;

  @Column('simple-array', { nullable: true })
  tags?: string[];

  @Column('simple-array', { nullable: true })
  image_urls?: string[];

  @ManyToOne(() => User, user => user.blogs)
  @JoinColumn({ name: 'author_id' })
  author: User;
}
