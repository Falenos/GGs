const neo4j = require('neo4j-driver');
const data = require('./mockData.json'); // Replace with the path to your JSON data file

// Configure the Neo4j driver to connect to your database
const driver = neo4j.driver(
  'bolt://localhost:7687', // Replace with your Neo4j server URL
  neo4j.auth.basic('neo4j', 'paparouna666') // Replace with your Neo4j username and password
);

// Create a Neo4j session
const session = driver.session();

// Define a function to create nodes and relationships based on your data
async function populateDatabase() {
  try {
    // Create users
    for (const user of data.users) {
      await session.run(
        'MERGE (u:User {id: apoc.create.uuid(), username: $username, email: $email, hashed_password: $hashed_password})',
        user
      );
    }

    // Create stories
    for (const story of data.stories) {
      await session.run(
        'MERGE (s:Story {id: apoc.create.uuid(), title: $title, structure_type: $structure_type, creation_date: $creation_date, status: $status, price: $price})',
        story
      );
    }

    // Create pages
    for (const page of data.pages) {
      await session.run(
        'MERGE (p:Page {id: apoc.create.uuid(), title: $title, content: $content, page_type: $page_type, status: $status})',
        page
      );
    }

    // Create relationships between users and stories
    for (const relationship of data.userStoryRelationships) {
      const { username, story_title, role } = relationship;
      let relationshipType;

      if (role === 'AUTHOR') {
        relationshipType = 'AUTHOR';
      } else if (role === 'WRITER') {
        relationshipType = 'WRITER';
      } else if (role === 'READER') {
        relationshipType = 'READER';
      }

      await session.run(
        `MATCH (u:User {username: $username}), (s:Story {title: $story_title}) CREATE (u)-[:${relationshipType}]->(s)`,
        { username, story_title }
      );
    }

    // Create relationships between pages and stories
    for (const relationship of data.pageStoryRelationships) {
      await session.run(
        'MATCH (p:Page {title: $page_title}), (s:Story {title: $story_title}) CREATE (p)-[:BELONGS_TO]->(s)',
        relationship
      );
    }

    // Create user feedback
    for (const feedback of data.userFeedback) {
      await session.run(
        `MATCH (u:User {username: $username}), (s:Story {title: $story_title}) CREATE (u)-[:PROVIDED_FEEDBACK]->(s)`,
        feedback
      );
    }

    // Create rich media nodes
    for (const media of data.richMedia) {
      await session.run(
        'CREATE (m:RichMedia {id: apoc.create.uuid(), media_type: $media_type, media_url: $media_url, description: $description})',
        media
      );
    }

    // Create tags and relationships to stories
    for (const tag of data.tags) {
      await session.run(
        'MERGE (t:Tag {id: apoc.create.uuid(), name: $name})',
        tag
      );

      for (const story of data.stories) {
        await session.run(
          `MATCH (t:Tag {name: $tag_name}), (s:Story {title: $story_title}) CREATE (s)-[:HAS_TAG]->(t)`,
          { tag_name: tag.name, story_title: story.title }
        );
      }
    }

    // Create links between pages
    for (const link of data.links) {
      await session.run(
        'MATCH (source:Page {title: $source_page_title}), (target:Page {title: $target_page_title}) CREATE (source)-[:LINKS_TO]->(target)',
        link
      );
    }

    console.log('Database populated successfully');
  } catch (error) {
    console.error('Error populating database:', error);
  } finally {
    // Close the Neo4j session and driver when done
    session.close();
    driver.close();
  }
}

// Call the populateDatabase function to start the population process
populateDatabase();
