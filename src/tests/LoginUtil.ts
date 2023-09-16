import express from 'express';
import request from "supertest";
import LoginDTO from '../dtos/auth/LoginDTO';
import TokenDTO from '../dtos/auth/TokenDTO';

const makeLogin = async (email: string, password: string, app: express.Application) => {
  const loginDTO: LoginDTO = {
    email, password
  };

  const response = await request(app).post('/api/auth/login')
    .send(loginDTO);
  expect(response.statusCode).toBe(200);
  const content = response.body as TokenDTO;
  return content.access_token;
}

export default makeLogin;
