export default interface Journal {
  _id: string;
  name: string;
  journalGroup: {
    _id: string;
    name: string;
  };
  tags: string[];
  description: string;
  editors: EditorInJournal[];
  status: boolean;
  contributors: ContributorInJournal[];
  createdBy: {
    _id: string;
    displayName: string;
    at: Date;
  };
  publishedAt?: Date;
}

export interface EditorInJournal {
  _id: string;
  name: string;
  photoURL?: string;
}

export interface ContributorInJournal {
  _id: number;
  name: string;
  contributes: string;
}
