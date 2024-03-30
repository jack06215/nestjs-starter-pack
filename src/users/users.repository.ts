import { EntityRepository } from '@mikro-orm/postgresql';
import * as bcrypt from 'bcrypt';

import { UserEntity } from '@local/entities/users.entity';
import { ResourceNotFound } from '@local/shared/api';

export class UsersRepository extends EntityRepository<UserEntity> {
  async findByUsername(username: string): Promise<UserEntity> {
    const user = await this.findOne({ username });
    return user;
  }

  async findById(id: string): Promise<UserEntity> {
    const user = await this.findOne({ id });
    return user;
  }

  async createUser(username: string, password: string): Promise<UserEntity> {
    const user = await this.findOne({ username });
    if (user) {
      throw new ResourceNotFound('Username already exists');
    }
    // create hashed password to stored in the database
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new UserEntity({ username, password: hashedPassword }, [], []);
    await this.getEntityManager().persistAndFlush(newUser);
    return newUser;
  }
}
