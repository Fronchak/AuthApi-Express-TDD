import { Sequelize } from 'sequelize-typescript';
import path from 'path';
import UserRepository from '../UserRepository';
import User from '../../models/User';
import Role from '../../models/Role';

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
    const user = await User.create({
      id: 10,
      email: existingMail,
      password: '123'
    });
    const adminRole = await Role.create({ name: 'admin' });
    const workerRole = await Role.create({ name: 'worker' });
    await user.$add('role', adminRole);
    await user.$add('role', workerRole);

    userRepository = new UserRepository();
  })

  test('findByEmail should return null when email does not exists', async () => {
    const result = await userRepository.findByEmail(nonExistingEmail);

    expect(result).toBeNull();
  });

  test('findByEmail should return entity with roles when email exists', async() => {
    const result = await userRepository.findByEmail(existingMail);

    expect(result).not.toBeNull();
    expect(result!.id).toBe(10);
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
});
