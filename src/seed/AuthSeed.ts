import BCryptPasswordEncoder from "../components/BCryptPasswordEncoder"
import Role from "../models/Role";
import User from "../models/User"

export const adminEmail = 'admin@gmail.com';
export const adminPassword = 'admin';
export const workerEmail = 'worker@gmail.com';
export const workerPassword = 'worker';
export const userEmail = 'user@gmail.com';
export const userPassword = 'user';

const seedUsers = async() => {
  const passwordEncoder = new BCryptPasswordEncoder();
  const adminUser = await User.create({
    email: adminEmail,
    password: passwordEncoder.hash(adminPassword)
  });
  const workerUser = await User.create({
    email: workerEmail,
    password: passwordEncoder.hash(workerPassword)
  });
  const nomalUser = await User.create({
    email: userEmail,
    password: passwordEncoder.hash(userPassword)
  });
  const adminRole = await Role.create({ name: 'admin' });
  const workerRole = await Role.create({ name: 'worker' });
  await adminUser.$add('role', adminRole);
  await workerUser.$add('role', workerRole);
}

export default seedUsers;
