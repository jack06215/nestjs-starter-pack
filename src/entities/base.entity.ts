import { Entity, BaseEntity as MKBaseEntity, Property } from '@mikro-orm/core';

@Entity({ abstract: true })
export abstract class BaseEntity extends MKBaseEntity {
  @Property({
    type: 'datetime',
    name: 'created_at',
    onCreate: () => new Date(),
    nullable: false,
    comment: 'Entity create datetime',
  })
  createdAt: Date;

  /**
   * Entity update datetime
   */
  @Property({
    type: 'datetime',
    name: 'updated_at',
    onCreate: () => new Date(),
    onUpdate: () => new Date(),
    nullable: false,
    comment: 'Entity update datetime',
  })
  updatedAt: Date;
}
