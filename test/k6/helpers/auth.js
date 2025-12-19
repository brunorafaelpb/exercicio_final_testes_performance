import http from 'k6/http';
import { check } from 'k6';

export function login(baseUrl, username, password) {
  const response = http.post(`${baseUrl}/login`, JSON.stringify({
    username: username,
    password: password
  }), {
    headers: {
      'Content-Type': 'application/json'
    }
  });

  check(response, {
    'login status is 200': (r) => r.status === 200
  });

  return response.json().token;
}