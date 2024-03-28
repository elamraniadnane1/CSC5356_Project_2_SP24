import neo4j from 'neo4j-driver'

const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', 'lina2015'))

const getPostsFromNeo4j = async (userHashTags) => {
    const session = driver.session()
    try {
        const result = await session.run(
            `MATCH (t:Tweet)-[:CONTAINS]->(h:Hashtag)
            WHERE h.name IN $tags
            RETURN t.text AS tweet, t.createdAt AS postedOn
            ORDER BY t.createdAt DESC
            `,
            { tags: userHashTags }
        )
        const posts = result.records.map((record) => ({
            tweet: record.get('tweet'),
            postedOn: record.get('postedOn')
        }))
        return posts
    } finally {
        await session.close()
    }
}

export default getPostsFromNeo4j
