import request from "supertest";
import App from "../../App";
import UserRegisterDTOBuilder from "../../builders/Auth/UserRegisterDTOBuilder";

describe('AuthController', () => {


  test('register should return unprocessable when email is null', async () => {
    const dto = UserRegisterDTOBuilder.aUserRegisterDTO().withANullEmail().build();
    const response = await request(App()).post('/api/auth/register')
        .send(dto);

    expect(response.statusCode).toBe(422);
  });

});
