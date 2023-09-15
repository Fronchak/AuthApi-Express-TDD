import IPasswordEncoder from "../interfaces/IPasswordEncoder";
import bcrypt from 'bcrypt';

class BCryptPasswordEncoder implements IPasswordEncoder {

  hash(rawPassword: string): string {
    const salt = bcrypt.genSaltSync();
    return bcrypt.hashSync(rawPassword, salt);
  }

  passwordMatch(rawPassword: string, hashed: string): boolean {
    return bcrypt.compareSync(rawPassword, hashed);
  }
}

export default BCryptPasswordEncoder;
