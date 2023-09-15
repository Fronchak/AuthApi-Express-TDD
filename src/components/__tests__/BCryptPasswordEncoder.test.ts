import BCryptPasswordEncoder from "../BCryptPasswordEncoder";

describe('BCryptPasswordEncoder', () => {

  const passwordEncoder: BCryptPasswordEncoder = new BCryptPasswordEncoder();

  test('hash should return a different password', () => {
    const raw = '123456';

    const hashed = passwordEncoder.hash(raw);

    expect(hashed).not.toBe(raw);
    expect(hashed.length).toBeGreaterThan(30);
  });

  test('passwordMatch should return false when password is incorrect', () => {
    const hashed = passwordEncoder.hash('123456');

    const match = passwordEncoder.passwordMatch('12345', hashed);

    expect(match).toBeFalsy();
  });

  test('passwordMatch should return true when password is correct', () => {
    const raw = '123456';
    const hashed = passwordEncoder.hash(raw);

    const match = passwordEncoder.passwordMatch(raw, hashed);

    expect(match).toBeTruthy();
  });
});
