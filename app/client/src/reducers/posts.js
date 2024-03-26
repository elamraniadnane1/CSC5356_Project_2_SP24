// All the action types in this application and what they return

// As soon as the action is dispatched, the reducer will be called
// The reducer will then update the state based on the action
// and return it to the component that called that action

export default (posts = [], action) => {
  switch (action.type) {
    case 'FETCH_ALL':
      return action.payload
    case 'DELETE':
      return posts.filter((post) => post.id !== action.payload)
    case 'CREATE':
      return [...posts, action.payload]
    case 'UPDATE':
      return posts.map((post) =>
        post._id === action.payload._id ? action.payload : post
      )
    default:
      return posts
  }
}
