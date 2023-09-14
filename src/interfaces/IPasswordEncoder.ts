interface IPasswordEncoder {

  hash(rawPassword: string): string;

  passwordMatch(rawPassword: string, hashed: string): boolean;
}

export default IPasswordEncoder;
