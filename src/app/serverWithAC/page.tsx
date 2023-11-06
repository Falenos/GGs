// import StoryCard from "@/components/StoryCard";
import { getClient } from "@/apollo/clientForServer";
import { Story } from "@/types";
import { gql } from "@apollo/client";

const GET_STORIES = gql`
  query GetStories {
    stories {
      id
      title
    }
  }
`;

export default async function Test() {
  const client = getClient();
  const { data } = await client.query({ query: GET_STORIES });

  return (
    <div className="stories">
      {(data?.stories || []).map((story: Story) => (
        <div key={story.id}>{story.id}</div>
      ))}
    </div>
  );
}
// <StoryCard id={story.id} key={story.id} />
