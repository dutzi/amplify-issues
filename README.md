# AWS Amplify Issues

Our setup is:

```
❯ node --version
v16.17.1

❯ amplify --version
10.6.1
```

The following is a minimal reproduction of the issue we're facing, when creating this demo I followed the [Amplify Getting Started Guide](https://docs.amplify.aws/start/), and then added [this block of code](./src/app.js#L27-L46).

The issue we're facing is that when:

1. Starting the app (`npm start`)
2. Running the mock server (`amplify mock api`)
3. Opening the app in the browser (http://localhost:8080/)

The [app makes a GQL Query](./src/app.js#L28-L45) for `listTodos`, passing, as variables the following object:

```js
const variables = {
  filter: { description: { attributeExists: true } },
};
```

The query returns the following:

```json
{
  "data": {
    "listTodos": null
  },
  "errors": [
    {
      "message": "Value provided in ExpressionAttributeValues unused in expressions: keys: {:description_attributeExists}",
      "errorType": "DynamoDB:ValidationException",
      "data": null,
      "errorInfo": null,
      "path": ["listTodos"],
      "locations": [
        {
          "line": 2,
          "column": 3,
          "sourceName": "GraphQL request"
        }
      ]
    }
  ]
}
```

Note that without passing `attributeExists: true`, _or_ when working against the actual backend (not the mock server), the query works as expected, returning the following:

```json
{
  "data": {
    "listTodos": {
      "items": [
        {
          "id": "a815c4c3-2ab3-4ea6-b797-d95b0a91a4d7",
          "name": "Use AppSync",
          "description": "Realtime and Offline (1/11/2023, 10:23:38 AM)",
          "createdAt": "2023-01-11T08:23:38.685Z",
          "updatedAt": "2023-01-11T08:23:38.685Z"
        },
        {
          "id": "332ee399-9a04-42e8-a9bb-f76aa73f3d27",
          "name": "Use AppSync",
          "description": "Realtime and Offline (1/11/2023, 10:23:30 AM)",
          "createdAt": "2023-01-11T08:23:31.207Z",
          "updatedAt": "2023-01-11T08:23:31.207Z"
        }
      ],
      "nextToken": null
    }
  }
}
```
