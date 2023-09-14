import UserEntity from "../../entities/UserEntity";

class UserBuilder {

  public static readonly id = 1;
  public static readonly email = "mail@gmail.com";
  public static readonly password = "123456";

  private user: UserEntity;

  private constructor() {
    this.user = {
      id: UserBuilder.id,
      email: UserBuilder.email,
      password: UserBuilder.email
    }
  }

  static aUser = (): UserBuilder => {
    return new UserBuilder();
  }

  build = (): UserEntity => {
    return this.user;
  }
}

export default UserBuilder;
