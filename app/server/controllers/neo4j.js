import neo4j from 'neo4j-driver'

const driver = neo4j.driver('bolt://localhost:7687/neo4j', neo4j.auth.basic('ayoub', '123456789'))

export const getPostsFromNeo4j = async (hashTags) => {
    const session = driver.session()
    try {
        if (hashTags.length === 0) return []
        const hashtagsQueryPart = hashTags.map((tag) => `t.text CONTAINS '${tag.replace(/'/g, "\\'")}'`).join(' OR ')

        const query = `
            MATCH (t:Tweet)
            WHERE ${hashtagsQueryPart}
            RETURN t.text AS TweetText
            LIMIT 50
        `

        const result = await session.run(query)
        return result.records.map((record) => ({
            TweetText: record.get('TweetText')
        }))
    } finally {
        await session.close()
    }
}

export const postTweetToNeo4j = async (tweet, userId, score, comparative) => {
    const session = driver.session()
    try {
        const query = `
        CREATE (t:Tweet {
            text: "${tweet}",
            created_at: "${new Date().toISOString()}",
            id_str: "${userId}",
            favorites: 0,
            sentimentScore: ${score},
            sentimentComparative: ${comparative}
        })
        RETURN t
        `

        const result = await session.run(query)
        console.log('\nTweet posted to Neo4j:\n', result)
        return result
    } finally {
        await session.close()
    }
}

// export default getPostsFromNeo4j
