export default (posts = [], action) => {
    switch (action.type) {
        case 'FETCH_ALL':
            return action.payload
        case 'KAFKA':
            return [...posts, action.payload]
        case 'CREATE':
            return [...posts, action.payload]
        case 'SENTIMENT':
            return action.payload
        default:
            return posts
    }
}
