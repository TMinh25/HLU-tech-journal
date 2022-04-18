export default interface INotification {
  _id: string;
  title: string;
  content?: string;
  detail?: string;
  link?: string;
  createdAt: Date;
}
