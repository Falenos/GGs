import { gql } from "@apollo/client";

export default gql`
  # Define the User type
  type User {
    id: ID! @id
    _id: Int
      @cypher(statement: "RETURN id(this) as result", columnName: "result")
    username: String!
    email: String!
    hashed_password: String!
    authoredStories: [Story!]! @relationship(type: "AUTHOR", direction: OUT)
    writerStories: [Story!]! @relationship(type: "WRITER", direction: OUT)
    readerStories: [Story!]! @relationship(type: "READER", direction: OUT)
    # roles: [UserRole!]!
    activityLogs: [ActivityLog!]!
    feedback: [UserFeedback!]!
  }

  # Define the Story type
  type Story {
    id: ID! @id
    _id: Int
      @cypher(statement: "RETURN id(this) as result", columnName: "result")
    title: String!
    structure_type: String!
    creation_date: String!
    author: User! @relationship(type: "AUTHOR", direction: IN)
    writers: [User!]! @relationship(type: "WRITER", direction: IN)
    readers: [User!]! @relationship(type: "READER", direction: IN)
    status: String!
    price: Float!
    pages: [Page!]!
    # variables: [Variable!]!  # Skipped: Custom Variables
    versions: [StoryVersion!]!
    feedback: [UserFeedback!]!
    tags: [Tag!]!
    # mediaAssets: [RichMedia!]!  # Skipped: Rich Media
  }

  # Define the UserOwnedStory type (Removed: No longer needed)
  # type UserOwnedStory {
  #   id: ID! @id
  #   user: User! @relationship(name: "USER_OWNED_STORY", direction: IN)
  #   story: Story! @relationship(name: "USER_OWNED_STORY", direction: OUT)
  #   purchase_date: String!
  # }

  # Define the UserRole type
  # type UserRole {
  #   id: ID! @id
  #   user: User!
  #   story: Story!
  #   role: String!
  # }

  # Define the Page type
  type Page {
    id: ID! @id
    _id: Int
      @cypher(statement: "RETURN id(this) as result", columnName: "result")
    title: String!
    content: String!
    story: Story!
    page_type: String!
    status: String!
    # rich_media: [RichMedia!]!  # Skipped: Rich Media
    links: [Link!]! @relationship(type: "LINK", direction: OUT)
  }

  # Define the Variable type
  # type Variable {
  #   id: ID! @id
  #   name: String!
  #   initial_value: String!
  #   story: Story!
  # }

  # Define the ActivityLog type
  type ActivityLog {
    id: ID! @id
    _id: Int
      @cypher(statement: "RETURN id(this) as result", columnName: "result")
    user: User!
    action: String!
    target: String!
    timestamp: String!
  }

  # Define the StoryVersion type
  type StoryVersion {
    id: ID! @id
    _id: Int
      @cypher(statement: "RETURN id(this) as result", columnName: "result")
    story: Story!
    version_number: Int!
    content_snapshot: String!
    changes_made: String!
    author_of_changes: String!
    change_description: String!
    creation_date: String!
  }

  # Define the UserFeedback type
  type UserFeedback {
    id: ID! @id
    _id: Int
      @cypher(statement: "RETURN id(this) as result", columnName: "result")
    user: User!
    story: Story!
    rating: Float!
    feedback_text: String!
    helpfulness_score: Int!
    flagged_as_inappropriate: Boolean!
    timestamp: String!
  }

  # Define the RichMedia type
  # type RichMedia {
  #   id: ID! @id
  #   media_type: String!
  #   media_url: String!
  #   description: String!
  # }

  # Define the Tag type
  type Tag {
    id: ID! @id
    _id: Int
      @cypher(statement: "RETURN id(this) as result", columnName: "result")
    name: String!
    stories: [Story!]! @relationship(type: "STORY_TAG", direction: IN)
  }

  # Define the Link type
  type Link {
    id: ID! @id
    _id: Int
      @cypher(statement: "RETURN id(this) as result", columnName: "result")
    source: Page!
    target: Page!
  }

  # Define search queries
  type Query {
    searchStoryByTitle(title: String!): [Story]
      @cypher(
        statement: "MATCH (s:Story) WHERE toLower(s.title) CONTAINS toLower($title) RETURN s as result"
        columnName: "result"
      )
  }
`;
