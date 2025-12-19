import faker from 'k6/x/faker';

export function generateRandomUser() {
  return {
    username: faker.person.name(),
    password: faker.internet.password()
  };
}