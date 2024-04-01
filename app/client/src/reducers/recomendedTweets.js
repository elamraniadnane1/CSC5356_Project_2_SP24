export default (tweets = [], action) => {
    switch (action.type) {
        case 'KAFKA':
            return [...tweets, action.payload]
        case 'SENTIMENT':
            return action.payload
        default:
            return tweets
    }
}
