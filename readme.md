<p align="center">
An extension for <a href="https://github.com/MartinDrost/nest-utilities-client">nest-utilities-client</a>, providing an easy way to transition your HTTP services and data to a global state through React hooks.
</p>

## Why?

Fetching data and updating user interfaces is a logic pattern we use all time time in our React apps. There are many ways of achieving a likewise pattern, think of simply fetching from `componentDidMount` or using a global state manager like Mobx or Redux. However you solve the problem, it will inevitably lead to a considerable amount of boilerplate code which has to be repeated every time data needs to be fetched -- let alone sharing data between multiple components.

This package provides a simpler way to manage data from a server (that utilizes [nest-utilities](https://www.npmjs.com/package/nest-utilities)), for apps that use [nest-utilities-client](https://www.npmjs.com/package/nest-utilities-client).

Using data, fetch state, errors and more can be done in a single line of code. States from identical fetch requests are shared between components, making it possible for multiple live components to draw resources from the same state. Essentially functioning as a global state manager for remote data from your API.

## How to use & examples

The packages provides a set of pre-made hooks regarding common use cases for persistant data (e.g. CRUD functions).

| Hook        | CRUD Function |
| ----------- | ------------- |
| `useAll`    | GET           |
| `useById`   | GET           |
| `useDelete` | DELETE        |
| `useMany`   | GET           |
| `usePatch`  | PATCH         |
| `usePost`   | POST          |
| `usePut`    | PUT           |

Or, for edge cases: [`useRequest`](#useRequestservice-query-method-httpOptions-stateOptions).

All these hooks return an [IRequestState](#interface-IRequestState) object. The following example implements request state properties in a practical context.

#### Simple implementation

This react function component renders some user info.

```typescript
function User({ id: string }) {
  const { data } = useById(userService, id);

  return (
    <div data-id={data?.id}>
      <p>{data?.firstName}</p>
      <p>{data?.email}</p>
      <p>{data?.dateOfBirth}</p>
    </div>
  );
}
```

#### Extensive example

This example renders a list of user mail adresses, and implements all provided state properties.

```typescript
function EmailList() {
  // Create a request state for "all" users.
  const { data, response, fetchState, call, cacheKey, service } = useAll(
    // pass our user service
    userService,

    // limit results by 10, using http options
    { limit: 10 },

    // cache the response data
    { cache: true }
  );

  // When the `cache` option is set, data will be saved to local storage under a key. This key is provided through `cacheKey`.
  useEffect(() => {
    console.log(localStorage.getItem(cacheKey));
  }, [cacheKey]);

  // Show a loading message while promise is pending
  if (fetchState === FetchState.Pending) return 'Loading...';

  // Show email list when response is ok, else show error.
  return response?.ok ? (
    <div>
      {/* Call the provided `call` method, which will (re)execute the fetch request. */}
      <button onClick={() => call()}>{'Refresh data'}</button>

      {/* Render your data */}
      {data?.map((user) => (
        <div key={user.id}>{user.email}</div>
      ))}
    </div>
  ) : (
    <p>Error: {response?.data.message}</p>
  );
}
```

### Custom hooks

Ofcourse, the provided hooks aren't restricted to usage directly in a React function component. React hooks were created for reusable state logic and this package adheres to that philosophy.

#### A `useAll` implementation with some preset http options.

```typescript
/**
 * Gets 10 most popular articles and their authors.
 */
function usePopularArticles() {
  return useAll(articleService, {
    sort: ['-likesAmount'],
    populate: ['author'],
    limit: 10,
  });
}
```

#### A custom authorization state manager

```typescript
/**
 * Manages a session token.
 */
function useSession() {
  const { data: sessionToken, response, call, service, cacheKey } = usePost(
    authenticationService,
    { populate: ['user'] },
    { cache: 'authentication' }
  );

  // Create login call
  const login = useCallback(
    async (credentials: FormData) => await call(credentials as any),
    [call]
  );

  // Create validate call
  const validate = useCallback(async () => await call(service.validate()), [
    call,
  ]);

  useEffect(() => {
    const { token } = sessionToken;
    // Do something with the cache key and session token.
    // For example, pass the token to your HTTP Headers in some base service class.
  }, [cacheKey, sessionToken]);

  return {
    login,
    validate,
    response,
    sessionToken,
  };
}

function App() {
  const { login, sessionToken } = useSession();

  if (sessionToken?.isActive) return (
    <div>Hello, {sessionToken.user?.name}!</div>
  );

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      login(new FormData(e.target);
    }}>
      <input name="username" />
      <input name="password" />
    </form>
  );
}
```

#### Shared state

In this example, we have a Player list component, and a Status component. `PlayerList` will display a list of available players, while `Status` will display a welcome message, and the total amount of existing players.

Executing `call` in component `PlayerList` will also trigger an update in component `Status`.

```typescript
// A.tsx
function PlayerList() {
  const { data: players, call } = useAll(playerService, { select: ['id'] });

  useEffect(() => {
    // Fetch all players every 5 seconds. This will also cause `Status @ B.tsx` to update!
    setInterval(() => call(), 5000);
  }, []);

  return players?.map((player) => <div>{player.name}</div>);
}

// B.tsx
function Status() {
  // This hook as identical parameters as in PlayerList, so that particular state will be used:
  const { response } = useAll(playerService, { select: ['id'] });

  // When `PlayerList @ A.tsx` executes it's call, this component will also update!
  return (
    <div>
      <p>Total available players: {response?.headers.get('X-total-count')}</p>
    </div>
  );
}

// C.txt
function App() {
  return (
    <>
      <Status />
      <PlayerList />
    </>
  );
}
```

## API reference

### `useAll(service, httpOptions, stateOptions)`

Use a request state for all models. Will immediately fetch on creation, unless set otherwise in `stateOptions`.

**Arguments**

`service`: [CrudService](https://www.npmjs.com/package/nest-utilities-client)

`httpOptions?`: [IHttpOptions](https://www.npmjs.com/package/nest-utilities-client)

`stateOptions?`: [IStateOptions](#interface-IStateOptions)

**Returns**

[IRequestState](#interface-IRequestState)

**Example**

```typescript
const { data: animals } = useAll(animalService);
```

### `useById(service, id, httpOptions, stateOptions)`

Use a request state for a single model, by model id. Will immediately fetch on creation, unless set otherwise in `stateOptions`.

**Arguments**

`service`: [CrudService](https://www.npmjs.com/package/nest-utilities-client)

`id?`: string

`httpOptions?`: [IHttpOptions](https://www.npmjs.com/package/nest-utilities-client)

`stateOptions?`: [IStateOptions](#interface-IStateOptions)

**Returns**

[IRequestState](#interface-IRequestState)

**Example**

```typescript
const { data: car } = useById(carService, '<id>');
```

### `useDelete(service, id, httpOptions, stateOptions)`

Use a request state for a single model that is to be deleted.

This method will _not_ be called immediately on creation, but instead needs to be called with it's returned `call` property to actually delete the model.

**Arguments**

`service`: [CrudService](https://www.npmjs.com/package/nest-utilities-client)

`id?`: string

`httpOptions?`: [IHttpOptions](https://www.npmjs.com/package/nest-utilities-client)

`stateOptions?`: [IStateOptions](#interface-IStateOptions)

**Returns**

[IRequestState](#interface-IRequestState)

**Example**

```typescript
const { data: covid19, call } = useDelete(pandemicService, '<id>');

const clickHandler = useCallback(() => {
  // delete the model
  call();
}, [call]);
```

### `useMany(service, ids, httpOptions, stateOptions)`

Use a request state for a set of models, by id's. Will immediately fetch on creation, unless set otherwise in `stateOptions`.

**Arguments**

`service`: [CrudService](https://www.npmjs.com/package/nest-utilities-client)

`ids`: Array\<string>

`httpOptions?`: [IHttpOptions](https://www.npmjs.com/package/nest-utilities-client)

`stateOptions?`: [IStateOptions](#interface-IStateOptions)

**Returns**

[IRequestState](#interface-IRequestState)

**Example**

```typescript
const { data: guitars } = useMany(guitarService, ['<id1>', '<id2>']);
```

### `usePatch(service, id, httpOptions, stateOptions)`

Use a request state to patch a model by id.

This method will _not_ be called immediately on creation, but instead needs to be called with it's returned `call` property to actually patch the model.

**Arguments**

`service`: [CrudService](https://www.npmjs.com/package/nest-utilities-client)

`id?`: string

`httpOptions?`: [IHttpOptions](https://www.npmjs.com/package/nest-utilities-client)

`stateOptions?`: [IStateOptions](#interface-IStateOptions)

**Returns**

[IRequestState](#interface-IRequestState)

**Example**

```typescript
const { call: patch } = usePatch(carService, '<id>');

const submitHandler = useCallback(
  (formData: FormData) => {
    patch(formData);
  },
  [call]
);
```

### `usePost(service, httpOptions, stateOptions)`

Use a request state to create a model.

**Arguments**

`service`: [CrudService](https://www.npmjs.com/package/nest-utilities-client)

`httpOptions?`: [IHttpOptions](https://www.npmjs.com/package/nest-utilities-client)

`stateOptions?`: [IStateOptions](#interface-IStateOptions)

**Returns**

[IRequestState](#interface-IRequestState)

**Example**

```typescript
const { call: create } = usePost(fruitService);

const submitHandler = useCallback(
  (formData: FormData) => {
    create(formData);
  },
  [create]
);
```

### `usePut`

Use a request state to put a model by id.

This method will _not_ be called immediately on creation, but instead needs to be called with it's returned `call` property to actually update the model.

**Arguments**

`service`: [CrudService](https://www.npmjs.com/package/nest-utilities-client)

`id?`: string

`httpOptions?`: [IHttpOptions](https://www.npmjs.com/package/nest-utilities-client)

`stateOptions?`: [IStateOptions](#interface-IStateOptions)

**Returns**

[IRequestState](#interface-IRequestState)

**Example**

```typescript
const { call: put } = usePut(carService, '<id>');

const submitHandler = useCallback(
  (formData: FormData) => {
    put(formData);
  },
  [call]
);
```

### `useRequest(service, query, method, httpOptions, stateOptions)`

Use a request state.

**Arguments**

`service`: [CrudService](https://www.npmjs.com/package/nest-utilities-client)

`query?`: string

`method?`: "POST" \| "GET" \| "PUT" \| "PATCH" \| "DELETE", default "GET"

`httpOptions?`: [IHttpOptions](https://www.npmjs.com/package/nest-utilities-client)

`stateOptions?`: [IStateOptions](#interface-IStateOptions)

**Returns**

[IRequestState](#interface-IRequestState)

**Example**

```typescript
const { call, service } = useRequest(authenticationService, '', 'POST');

const login = useCallback(
  (credentials: FormData) => {
    login(credentials);
  },
  [call]
);

const validate = useCallback(async () => {
  return await service.validate();
}, [service]);
```

### `interface IRequestState`

| Property   | Type                                                                  |
| ---------- | --------------------------------------------------------------------- |
| cacheKey   | \<optional> string                                                    |
| data       | \<response data> \| null                                              |
| fetchState | [FetchState](#enum-FetchState)                                        |
| response   | [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) |
| service    | [CrudService](https://www.npmjs.com/package/nest-utilities-client)    |
| call       | [IStateUpdater](#function-IStateUpdater)                              |

### `interface IStateOptions`

| Property       | Type                                            |
| -------------- | ----------------------------------------------- |
| cache          | \<optional> string \| boolean                   |
| immediateFetch | \<optional> boolean                             |
| proxyMethod    | "POST" \| "GET" \| "PUT" \| "PATCH" \| "DELETE" |

### `enum FetchState`

| Field     | Key |
| --------- | --- |
| Fulfilled | 0   |
| Idle      | 1   |
| Pending   | 2   |
| Rejected  | 3   |

### `function IStateUpdater`

Executes a fetch call and updates state properties accordingly. Returns `true` if the http request was succesful, `false` if not.

**Arguments**

`body?`: Promise | Model | FormData | null

`proxy?`: boolean

**Returns**

boolean

**Examples**

Shoe update example.

```typescript
const { call } = usePatch(shoeService, '<id>');

// update our shoe
const submitHandler = useCallback(
  (formData: FormData) => {
    call(formData);
  },
  [call]
);

// fetch our shoe
const getData = useCallback(() => {
  // pass `true` to the proxy parameter. This will execute a GET request instead of PATCH.
  call(null, true);
}, [call]);
```
