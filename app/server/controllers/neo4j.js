import neo4j from 'neo4j-driver'

const driver = neo4j.driver('bolt://localhost:7687/neo4j', neo4j.auth.basic('ayoub', '123456789'))

const getPostsFromNeo4j = async (userHashTags) => {
    const session = driver.session()
    try {
        const result = await session.run(
            `    MATCH (t:Tweet)
            WHERE t.text CONTAINS '#Neo4j'
            RETURN t.text AS TweetText, t.id AS UserId
            LIMIT 10
            `
            // { tags: userHashTags }
        )
        // const posts = result.records.map((record) => ({
        //     tweet: record.get('tweet'),
        //     postedOn: record.get('postedOn')
        // }))
        return result
    } finally {
        await session.close()
    }
}

export default getPostsFromNeo4j
