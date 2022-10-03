# QwikQL

A GraphQL client for Qwik framework.

---

## Installation

```bash
npm install qwikql graphql graphql-request
```

To use it, wrap the root component with it, and specify the GraphQL server url using the `url` prop.

```jsx
import { QwikQL } from 'qwikql'

export default component$(() => {
  return (
    <QwikQL
      url="http://localhost:4000/graphql"
    >
      <QwikCity>
        // ...
      </QwikCity>
    </QwikQL>
  )
})
```

## Queries
QwikQL provides a use hook named `useQuery(QUERY)`. It takes the query as a parameter, and it returns `{ executeQuery$ }`.

`executeQuery$({ variables })` is a QRL function that takes the variables (like `{ variables: { id: 'example-id' } }`) and returns a promise with the results.

The best way to fetch data in Qwik is using `<Resource />` component. To utilize `<Resource />`, you have to create a resource using `useResource$` hook function.

Here's an example:

```jsx
import { useQuery } from 'qwikql'
import { gql } from 'graphql-request'

export default component$(() => {
  const ITEM_BY_ID = gql`
    query itemById($itemId: ID) {
      itemById(itemId: $itemId) {
        id
        title
      }
    }
  `

  const { executeQuery$ } = useQuery(ITEM_BY_ID)

  const item = useResource$(async () =>
    await executeQuery$({
      variables: { itemId: 'example-item-id' }
    })
  )

  return (
    <>
      <Resource
        value={item}
        onPending={() => (
          <>Loading Item</>
        )}
        onResolved={(data: any) => (
          <>{ data.itemById.title }</>
        )}
        onRejected={(error) => (
          <>Error fetching item: {error}</>
        )}
      />
    </>
  )
})
```

## Refetching

Since we are using `useResource$` for fetching the data, we just need to retrigger it when we want to refetch the data.

`useResource$` provides us with `track` function that watches a specific property in a store, and when that property is updated, then `useResource$` is called again.

So, we can use this feature refetch data when the query variables (or any state we want) change.

```jsx
import { useQuery } from 'qwikql'
import { ITEM_BY_ID } from '~/graphql/queries'
import { useStore } from '@builder.io/qwik'

export default component$(() => {
  const itemId = useStore({
    value: 'example-item-id'
  })
  const { executeQuery$ } = useQuery(ITEM_BY_ID)

  const item = useResource$(async ({ track }) => {
    track(itemId, 'value')
    return await executeQuery$({
      variables: { itemId: itemId.value }
    })
  })

  return (
    <>
      <Resource
        value={item}
        onPending={() => (
          <>Loading Item</>
        )}
        onResolved={(data: any) => (
          <>{ data.itemById.title }</>
        )}
        onRejected={(error) => (
          <>Error fetching item: {error}</>
        )}
      />
    </>
  )
})
```

### Manual refetching

In many cases, we want to refetch the query after a mutation is called, or when something happens, like a button click. In these cases, we wouldn't watch the query variables, instead we will watch a "refetch counter" that we create.

So, we'll create a store for refetch count, and start watching it in `useResource$`. To trigger refetch, we just need to increment that counter.

```jsx
import { useQuery } from 'qwikql'
import { ITEM_BY_ID } from '~/graphql/queries'
import { useStore } from '@builder.io/qwik'

export default component$(() => {
  // Create the refetch counter
  const refetchCount = useStore({ value: 0 })

  const { executeQuery$ } = useQuery(ITEM_BY_ID)

  const item = useResource$(async ({ track }) => {
    track(refetchCount, 'value')
    return await executeQuery$({
      variables: { itemId: 'example-item-id' }
    })
  })

  return (
    <>
      // Refetch on this button click
      <button
        onClick$={() => {
          refetchCount.value++
        }}
      >
        Refetch
      </button>

      <Resource
        value={item}
        onPending={() => (
          <>Loading Item</>
        )}
        onResolved={(data: any) => (
          <>{ data.itemById.title }</>
        )}
        onRejected={(error) => (
          <>Error fetching item: {error}</>
        )}
      />
    </>
  )
})
```

## Mutations

QwikQL provides `useMutation(MUTATION)` hook for GraphQL mutations. It takes the mutation as a parameter, and it returns `{ mutate$, result }`.

`mutate$(variables)` is a QRL function that takes a variables object to execute the mutation.

`result` is a store object that contains these variables: `{ data, loading, error }`.

Here's an example:

```jsx
import { useMutation } from 'qwikql'
import { gql } from 'graphql-request'

export const ADD_ITEM = gql`
  mutation addItem($input: AddItemInput!) {
    addItem(input: $input) {
      id
      title
    }
  }
`

export default component$(() => {
  const { mutate$, result } = useMutation(ADD_ITEM)

  return (
    <>
      { result.loading && <div>Adding Item...</div>}
      { result.error && <div>ERROR: { result.error.message }</div>}
      <input
        onKeyPress$={async (event) => {
          if (event.key === 'Enter') {
            const value = (event.target as HTMLInputElement).value
            await mutate$({
              input: {
                title: value
              }
            })
          }
        }}
      />
    </>
  )
})
```

## Setting Headers

There are two ways to set headers for your GraphQL operations, either directly as a prop to `<QwikQL />`:

```jsx
<QwikQL
  url="http://localhost:4000/graphql"
  headers={{
    authorization: 'auth-key'
  }}
>
</QwikQL>
```

Or you can set it using `useHeaders()` hook function:

```jsx
import { useHeaders } from 'qwikql'

export default component$(() => {
  const setHeaders = useHeaders()
  setHeader({
    authorization: 'auth-key'
  })
})
```

The latter is useful when you get the header values later in other components. A common example is setting the `authorization` after reading the token from the cookies.
