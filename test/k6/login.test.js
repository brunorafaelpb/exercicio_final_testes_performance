import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { getBaseUrl } from './helpers/baseUrl.js';
import { SharedArray } from 'k6/data';

const users = new SharedArray('users', function (){
    return JSON.parse(open('./data/users.data.json'))
})

export let options = {
  vus: 10,
  duration: '20s',
  thresholds: {
    http_req_duration: ['p(95)<2000']
  }
};

export default function () {
  const baseUrl = getBaseUrl();
  const user = users[(__VU - 1) % users.length];


  const username = user.username;
  const password = user.password;

  group('Login', function () {
    const res = http.post(
        `${baseUrl}/login`,
        JSON.stringify({ username, password }),
        { headers: { 'Content-Type': 'application/json'}}
    );
    check(res, {'Login status 200': (r) => r.status === 200});
    sleep(1)
  });
}