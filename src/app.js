import { Amplify, API, graphqlOperation } from "aws-amplify";

import awsconfig from "./aws-exports";
import { createTodo } from "./graphql/mutations";
import { listTodos } from "./graphql/queries";
import { onCreateTodo } from "./graphql/subscriptions";

Amplify.configure(awsconfig);

async function createNewTodo() {
  const todo = {
    name: "Use AppSync",
    description: `Realtime and Offline (${new Date().toLocaleString()})`,
  };

  return await API.graphql(graphqlOperation(createTodo, { input: todo }));
}

async function getData() {
  API.graphql(graphqlOperation(listTodos)).then((evt) => {
    evt.data.listTodos.items.map((todo, i) => {
      QueryResult.innerHTML += `<p>${todo.name} - ${todo.description}</p>`;
    });
  });
}

async function getDataAttributeExists() {
  const variables = {
    filter: { description: { attributeExists: true } },
  };
  API.graphql(graphqlOperation(listTodos, variables))
    .then((evt) => {
      console.log(
        "listTodos with attributeExists filter seems to work, please run the `amplify mock api` to see the error"
      );
      console.log(evt);
    })
    .catch((evt) => {
      console.log(
        "When passing the following variables to listTodos (when running against Amplify Mock):"
      );
      console.log(variables);
      console.log("We get the following error:");
      console.log(evt);
    });
}

const MutationButton = document.getElementById("MutationEventButton");
const MutationResult = document.getElementById("MutationResult");
const QueryResult = document.getElementById("QueryResult");
const SubscriptionResult = document.getElementById("SubscriptionResult");

MutationButton.addEventListener("click", (evt) => {
  createNewTodo().then((evt) => {
    MutationResult.innerHTML += `<p>${evt.data.createTodo.name} - ${evt.data.createTodo.description}</p>`;
  });
});

API.graphql(graphqlOperation(onCreateTodo)).subscribe({
  next: (evt) => {
    const todo = evt.value.data.onCreateTodo;
    SubscriptionResult.innerHTML += `<p>${todo.name} - ${todo.description}</p>`;
  },
});

getData();
getDataAttributeExists();
