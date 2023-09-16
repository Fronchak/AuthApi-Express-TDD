import BCryptPasswordEncoder from "../components/BCryptPasswordEncoder"
import Role from "../models/Role";
import User from "../models/User"

const seedUsers = async() => {
  const passwordEncoder = new BCryptPasswordEncoder();
  const adminUser = await User.create({
    email: 'admin@gmail.com',
    password: passwordEncoder.hash('admin')
  });
  const workerUser = await User.create({
    email: 'worker@gmail.com',
    password: passwordEncoder.hash('worker')
  });
  const nomalUser = await User.create({
    email: 'user@gmail.com',
    password: passwordEncoder.hash('user')
  });
  const adminRole = await Role.create({ name: 'admin' });
  const workerRole = await Role.create({ name: 'worker' });
  await adminUser.$add('role', adminRole);
  await workerUser.$add('role', workerRole);
}

export default seedUsers;
