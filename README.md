# API de Estoque e Usuários

Esta API permite o registro e login de usuários, além do gerenciamento de produtos em estoque.

## Executando a API

```bash
npm start
```

A API REST estará disponível em `http://localhost:3000`.

## Executando a API GraphQL

```bash
npm run start-graphql
```

# Testes de Performance

O teste implementa conceitos de teste de performance utilizando K6 para avaliar a API.

## Como Executar os Testes de Performance

1. Certifique-se de que a API está rodando na porta 3000 (ou configure `BASE_URL` via variável de ambiente).

2. Execute o teste:
   ```bash
   k6 run test/k6/product.test.js --env BASE_URL=http://localhost:3000
   ```

3. Para gerar relatório HTML com dashboard:
   ```bash
   K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_EXPORT=html-report.html k6 run test/k6/product.test.js --env BASE_URL=http://localhost:3000
   ```

## Conceitos Implementados

### Thresholds
Os thresholds definem critérios de sucesso para o teste. No código, é configurado para garantir que 95% das requisições tenham duração inferior a 2000ms.

```javascript
// Em test/k6/product.test.js
export let options = {
  thresholds: {
    http_req_duration: ['p(95)<2000']
  }};
```

### Checks
Os checks validam as respostas das requisições HTTP. São usados para verificar status codes das operações de registro, login e listagem de produtos.

```javascript
// Em test/k6/product.test.js
check(response, {
  'register status is 201': (r) => r.status === 201
});
```

### Helpers
Funções auxiliares que tem lógica reutilizável, como por exemplo, obter a URL base, fazer login e gerar usuários aleatórios.

```javascript
// Em test/k6/helpers/auth.js
export function login(baseUrl, username, password) {
  const response = http.post(`${baseUrl}/login`, JSON.stringify({
    username: username,
    password: password
  }), {
    headers: {
      'Content-Type': 'application/json'
    }
});
```

### Trends
Trends monitoram métricas customizadas, como a duração das requests para GET /products.

```javascript
// Em test/k6/product.test.js
import { Trend } from 'k6/metrics';
const listProductsTrend = new Trend('list_products_duration');

// Dentro do group 'List Products'
listProductsTrend.add(response.timings.duration);
```

### Faker
Biblioteca Faker gera dados falsos, porém com aparência de dados reais, tornando o teste mais realista.

```javascript
// Em test/k6/helpers/randomData.js
import faker from 'k6/x/faker';

export function generateRandomUser() {
  return {
    username: faker.person.name(),
    password: faker.internet.password()
  };
}
```

### Variável de Ambiente
Uso de `__ENV.BASE_URL` para configurar a URL base da API, permite a execução dos testes em diferentes ambientes. Nesse caso, também foi inserida uma opção para que o teste tenha uma URL padrão, que será utilizada se o usuário não informar BASE_URL via variável de ambiente.

```javascript
// Em test/k6/helpers/baseUrl.js
export function getBaseUrl() {
  return __ENV.BASE_URL || 'http://localhost:3000';
}
```

### Stages
Configuração de stages simula ramp up, steady state e ramp down de usuários virtuais, tornando o teste mais parecido com a realidade do dia a dia.

```javascript
// Em test/k6/product.test.js
export let options = {
  stages: [
    { duration: '2s', target: 5 },
    { duration: '10s', target: 5 },
    { duration: '2s', target: 50 },
    { duration: '10s', target: 50 },
    { duration: '8s', target: 0 },
  ]
};
```

### Reaproveitamento de Resposta e Uso de Token de Autenticação
Uma boa forma de reaproveitamente de resposta, é quando extraimos o token JWT da resposta do login e reutilizamos para autenticar a request de listagem de produtos.

```javascript
// Em test/k6/product.test.js
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
});
```

### Data-Driven Testing
Data-Driven Testing permite executar o teste com múltiplos conjuntos de dados externos, como um arquivo JSON ou array, para validar cenários variados sem alterar o código do teste.

```javascript
// Em test/k6/data/users.data.js
const users = [
  { username: "João Silva", password: "pass123" },
  { username: "Maria Santos", password: "pass123" },
  // ... mais usuários
];
export default users;
```

### Groups
Organização lógica dos testes em grupos para termos uma estrutura mais organizada e com melhor visualização.

```javascript
// Em test/k6/product.test.js
group('Register User', function () {
  // Código para registrar
});
```

## Relatório de Execução

O relatório HTML (`html-report.html`) mostra métricas detalhadas, incluindo durações, taxas de sucesso, e compliance com thresholds.
