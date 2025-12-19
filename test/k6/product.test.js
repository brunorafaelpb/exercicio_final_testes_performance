import http from 'k6/http';
import { check, group } from 'k6';
import { Trend } from 'k6/metrics';
import { getBaseUrl } from './helpers/baseUrl.js';
import { login } from './helpers/auth.js';
import { generateRandomUser } from './helpers/randomData.js';

export let options = {
  thresholds: {
    http_req_duration: ['p(95)<2000']
  },
  stages: [
    { duration: '2s', target: 5 },
    { duration: '10s', target: 5 },
    { duration: '2s', target: 50 },
    { duration: '10s', target: 50 } ,
    { duration: '8s', target: 0 },
  ]
};

const listProductsTrend = new Trend('list_products_duration');

export default function () {
  const baseUrl = getBaseUrl();
  const user = generateRandomUser();

  group('Register User', function () {
    const response = http.post(`${baseUrl}/register`, JSON.stringify({
      username: user.username,
      password: user.password
    }), {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    check(response, {
      'register status is 201': (r) => r.status === 201
    });
  });

  let token;
  group('Login', function () {
    token = login(baseUrl, user.username, user.password);
  });

  group('List Products', function () {
    const response = http.get(`${baseUrl}/products`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    check(response, {
      'list products status is 200': (r) => r.status === 200
    });

    listProductsTrend.add(response.timings.duration);
  });
}