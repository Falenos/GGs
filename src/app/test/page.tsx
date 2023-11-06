// import StoryCard from "@/components/StoryCard";
"use client";
import { Stories } from "@/types";
import { gql, useQuery } from "@apollo/client";

const GET_STORIES = gql`
  query GetStories {
    stories {
      id
      title
    }
  }
`;

export default function Test() {
  const { loading, error, data } = useQuery<{ stories: Stories }>(GET_STORIES);
  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  return (
    <div className="stories">
      {(data?.stories || []).map((story) => (
        <div key={story.id}>{story.id}</div>
      ))}
    </div>
  );
}
// <StoryCard id={story.id} key={story.id} />
