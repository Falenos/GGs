// Define the User type
interface User {
  id: string;
  username: string;
  email: string;
  hashed_password: string;
  authoredStories: Story[];
  ownedStories: Story[];
  writerStories: Story[];
  roles: UserRole[];
  activityLogs: ActivityLog[];
  feedback: UserFeedback[];
}

// Define the Story type
interface Story {
  id: string;
  title: string;
  structure_type: string;
  creation_date: string;
  author: User;
  owners: User[];
  writers: User[];
  status: string;
  price: number;
  pages: Page[];
  versions: StoryVersion[];
  feedback: UserFeedback[];
  tags: Tag[];
}

// Define the UserRole type
interface UserRole {
  id: string;
  user: User;
  story: Story;
  role: string;
}

// Define the Page type
interface Page {
  id: string;
  content: string;
  story: Story;
  page_type: string;
  status: string;
  links: Link[];
}

// Define the ActivityLog type
interface ActivityLog {
  id: string;
  user: User;
  action: string;
  target: string;
  timestamp: string;
}

// Define the StoryVersion type
interface StoryVersion {
  id: string;
  story: Story;
  version_number: number;
  content_snapshot: string;
  changes_made: string;
  author_of_changes: string;
  change_description: string;
  creation_date: string;
}

// Define the UserFeedback type
interface UserFeedback {
  id: string;
  user: User;
  story: Story;
  rating: number;
  feedback_text: string;
  helpfulness_score: number;
  flagged_as_inappropriate: boolean;
  timestamp: string;
}

// Define the Tag type
interface Tag {
  id: string;
  name: string;
  stories: Story[];
}

// Define the Link type
interface Link {
  id: string;
  source: Page;
  target: Page;
}

export type { User, Story, UserRole, Page, ActivityLog, StoryVersion, UserFeedback, Tag, Link };

export type Stories = Partial<Story> & {
  author: {
    id: string;
    username: string;
  };
  status: string;
  id: string;
  title: string;
}[];
