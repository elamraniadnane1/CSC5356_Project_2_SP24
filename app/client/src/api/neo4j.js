import neo4j from 'neo4j-driver'

// Connect to your local Neo4j database
const neo4jDriver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', 'lina2015'))

// Function to test Neo4j connection
const testNeo4jConnection = async () => {
    const session = neo4jDriver.session()
    try {
        const result = await session.run('RETURN "Hello, World!" AS message')
        console.log(result.records[0].get('message')) // Should log "Hello, World!"
    } finally {
        await session.close()
    }
}

// Call the test function (remove this after confirming the connection works)
testNeo4jConnection()
