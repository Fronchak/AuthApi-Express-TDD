import UserRegisterDTO from "../../dtos/auth/UserRegisterDTO";

class UserRegisterDTOBuilder {

  public static readonly email = "mail@gmail.com";
  public static readonly registerEmail = "register@gmail.com";
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

  public withABlankEmail = (): UserRegisterDTOBuilder => {
    this.userRegisterDTO.email = "    ";
    return this;
  }

  public withAnInvalidEmail = (): UserRegisterDTOBuilder => {
    this.userRegisterDTO.email = "mail@gmail";
    return this;
  }

  public withARegisterEmail = (): UserRegisterDTOBuilder => {
    this.userRegisterDTO.email = UserRegisterDTOBuilder.registerEmail;
    return this;
  }

  public withANullPassword = (): UserRegisterDTOBuilder => {
    this.userRegisterDTO.password = null;
    return this;
  }

  public withAShortPassword = (): UserRegisterDTOBuilder => {
    this.userRegisterDTO.password = "12345";
    this.userRegisterDTO.confirmPassword = "12345";
    return this;
  }

  public withADifferentConfirmPassword = (): UserRegisterDTOBuilder => {
    this.userRegisterDTO.password = UserRegisterDTOBuilder.password;
    this.userRegisterDTO.confirmPassword = UserRegisterDTOBuilder.password + '.';
    return this;
  }

  public build = (): UserRegisterDTO => {
    return this.userRegisterDTO;
  }
}

export default UserRegisterDTOBuilder;
