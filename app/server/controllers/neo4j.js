const getPostesFromNeo4j = async (userHashTags) => {
    const { hashTags } = userHashTags
    const session = driver.session()
    const posts = []
    for (let i = 0; i < hashTags.length; i++) {
        const result = await session.run(
            `MATCH (p:Post)-[:HASHTAG]->(h:HashTag)
            WHERE h.name = $hashTag
            RETURN p`,
            { hashTag: hashTags[i] }
        )
        result.records.forEach((record) => {
            posts.push(record.get('p').properties)
        })
    }
    session.close()
    return posts
}

export default getPostesFromNeo4j
