import { Sequelize } from 'sequelize-typescript';
import path from 'path';
import UserRepository from '../UserRepository';
import User from '../../models/User';
import Role from '../../models/Role';
import UserRole from '../../models/UserRole';
import { Op } from 'sequelize';
import UserEntity from '../../entities/UserEntity';

describe('UserRepository', () => {

  let sequelize: Sequelize;
  let userRepository: UserRepository;

  const nonExistingEmail = "nonexistingmaiL@gmail.com";
  const existingMail = "mail@gmail.com";

  beforeAll(async() => {
    sequelize = new Sequelize({
      database: 'tests',
      dialect: 'sqlite',
      username: 'root',
      password: '',
      storage: ':memory:',
      models: [path.join(__dirname, '..', '..', 'models')]
    });
    await sequelize.sync({ force: true });

    userRepository = new UserRepository();
  })

  beforeEach(async () => {
    await UserRole.destroy({
      where: {
        userId: {
          [Op.gte]: 1
        }
      }
    });
    await Role.destroy({
      where: {
        id: {
          [Op.gte]: 1
        }
      }
    });
    await User.destroy({
      where: {
        id: {
          [Op.gte]: 1
        }
      }
    });
  });

  test('findById should return null when id does not exists', async () => {
    const result = await userRepository.findById(100);

    expect(result).toBeNull();
  });

  test('findById should return entity with roles when id exists', async() => {
    const user = await User.create({
      id: 10,
      email: existingMail,
      password: '123'
    });
    const adminRole = await Role.create({ name: 'admin' });
    const workerRole = await Role.create({ name: 'worker' });
    await user.$add('role', adminRole);
    await user.$add('role', workerRole);

    const result = await userRepository.findById(10);

    expect(result).not.toBeNull();
    expect(result?.id).toBe(10);
    const roles = result?.roles;
    expect(roles?.length).toBe(2);
    expect(roles?.some((r) => r.name === 'admin')).toBeTruthy();
    expect(roles?.some((r) => r.name === 'worker')).toBeTruthy();
  });

  test('findById should return entity with no roles when id exists', async() => {
    const user = await User.create({
      id: 10,
      email: existingMail,
      password: '123'
    });

    const result = await userRepository.findById(10);

    expect(result).not.toBeNull();
    expect(result?.id).toBe(10);
    expect(result?.roles?.length).toBe(0);
  });

  test('findByEmail should return null when email does not exists', async () => {
    const result = await userRepository.findByEmail(nonExistingEmail);

    expect(result).toBeNull();
  });

  test('findByEmail should return entity with roles when email exists', async() => {
    const user = await User.create({
      email: existingMail,
      password: '123'
    });
    const adminRole = await Role.create({ name: 'admin' });
    const workerRole = await Role.create({ name: 'worker' });
    await user.$add('role', adminRole);
    await user.$add('role', workerRole);

    const result = await userRepository.findByEmail(existingMail);

    expect(result).not.toBeNull();
    const roles = result?.roles;
    expect(roles?.length).toBe(2);
    expect(roles?.some((r) => r.name === 'admin')).toBeTruthy();
    expect(roles?.some((r) => r.name === 'worker')).toBeTruthy();
  });

  test('findByEmail should return entity with no roles when email exists', async () => {
    const email = "othermail@gmail.com";
    await User.create({
      email,
      password: '123'
    });

    const result = await userRepository.findByEmail(email);

    expect(result).not.toBeNull();
    expect(result?.email).toBe(email);
    expect(result?.roles.length).toBe(0);
  });

  test('save should add new entity to the database', async() => {
    const email = "othermail@gmail.com";
    const password = '123456';
    const userEntity: UserEntity = {
      email,
      password
    } as UserEntity

    const user = await userRepository.save(userEntity);

    expect(await User.count()).toBe(1);
    expect(user.id).not.toBeNull();
    expect(await User.findOne({
      where: {
        email: email,
        password: password
      }
    })).not.toBeNull();
  });

  test('update should update values in the database', async() => {
    const id = 5;
    const oldEmail = "old@gmail.com";
    const oldPassword = "old";
    const newEmail = "new@gmail.com";
    const newPassword = 'new';
    await User.create({ id: 5, email: oldEmail, password: oldPassword });
    const userEntity: UserEntity = {
      id,
      email: newEmail,
      password: newPassword
    } as UserEntity

    const updated = await userRepository.update(userEntity);

    expect(await User.count()).toBe(1);
    expect(updated.id).not.toBeNull();
    expect(await User.findOne({
      where: {
        email: newEmail,
        password: newPassword
      }
    })).not.toBeNull();
  });

  test('delete should remove entity from database', async () => {
    const user = await User.create({
      id: 10,
      email: existingMail,
      password: '123'
    });
    const adminRole = await Role.create({ name: 'admin' });
    const workerRole = await Role.create({ name: 'worker' });
    await user.$add('role', adminRole);
    await user.$add('role', workerRole);
    const userEntity: UserEntity = {
      id: 10
    } as UserEntity;

    await userRepository.delete(userEntity);

    expect(await User.count()).toBe(0);
    expect(await UserRole.count()).toBe(0);
    expect(await Role.count()).toBe(2);
  });
});
