// import StoryCard from "@/components/StoryCard";

import { Story } from "@/types";

const GET_STORIES = `
  query GetStories {
    stories {
      id
      title
    }
  }
`;

export default async function Test() {
  // TODO: switch to env var
  const res = await fetch("http://localhost:3000/api/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: GET_STORIES }),
  });

  const { data } = await res.json();

  return (
    <div className="stories">
      {(data?.stories || []).map((story: Story) => (
        <div key={story.id}>{story.id}</div>
      ))}
    </div>
  );
}
// <StoryCard id={story.id} key={story.id} />
