export interface GroupMember {
  _id: string;
  username: string;
  displayName: string;
}

export interface Group {
  _id: string;
  name: string;
  description: string;
  members: GroupMember[];
  admins: GroupMember[];
  watchlist?: string;
}

