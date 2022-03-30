export default interface JournalGroup {
  _id: string;
  name: string;
  tags?: string[];
  createBy: {
    _id: string;
    at: Date;
  };
}
