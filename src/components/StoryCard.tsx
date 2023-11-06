import { gql, useQuery } from "@apollo/client";
import Link from "next/link";
import type { Story } from "../types";

const GET_STORY = gql`
  query GetStory($storyId: ID) {
    stories(where: { id: $storyId }) {
      id
      title
      status
      author {
        username
      }
    }
  }
`;

const StoryCard = ({ id }: { id: string }) => {
  const { loading, error, data } = useQuery<{ stories: Story[] }>(GET_STORY, {
    variables: { storyId: id },
  });

  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  const story = data!.stories[0];

  return (
    <div className="story-card">
      <div className="story-card-header">
        <Link
          className="link"
          href="/story/[story.id]"
          as={{
            pathname: `/story/${encodeURIComponent(story.title)}`,
          }}
        >
          <h2 className="title">{story.title}</h2>
        </Link>
        <Link
          className="edit-link"
          href="/edit-story/[story.id]"
          as={{
            pathname: `/edit-story/${encodeURIComponent(story.title)}`,
          }}
        >
          ✏️
        </Link>
      </div>
      <div className="story-card-body">
        <p>Author: {story.author.username}</p>
        <p>Status: {story.status}</p>
      </div>
      {/* <style jsx>
        {`
          .story-card {
            width: 200px;
            height: fit-content;
            margin: 10px;
            padding: 10px;
            box-sizing: border-box;
            border: 1px solid white;
            border-radius: 4px;
          }

          .story-card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .story-card-body {
            margin-top: 10px;
          }

          .title {
            text-align: center;
            text-decoration: underline;
          }
        `}
      </style> */}
    </div>
  );
};

export default StoryCard;
