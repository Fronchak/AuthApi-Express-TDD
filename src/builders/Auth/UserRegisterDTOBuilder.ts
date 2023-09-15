import UserRegisterDTO from "../../dtos/auth/UserRegisterDTO";

class UserRegisterDTOBuilder {

  public static readonly email = "mail@gmail.com";
  public static readonly password = "123456";
  public static readonly confirmPassword = "123456";

  private userRegisterDTO: UserRegisterDTO;

  private constructor() {
    this.userRegisterDTO = {
      email: UserRegisterDTOBuilder.email,
      password: UserRegisterDTOBuilder.password,
      confirmPassword: UserRegisterDTOBuilder.confirmPassword
    }
  }

  public static aUserRegisterDTO = (): UserRegisterDTOBuilder => {
    return new UserRegisterDTOBuilder();
  }

  public withANullEmail = (): UserRegisterDTOBuilder => {
    this.userRegisterDTO.email = null;
    return this;
  }

  public build = (): UserRegisterDTO => {
    return this.userRegisterDTO;
  }
}

export default UserRegisterDTOBuilder;
