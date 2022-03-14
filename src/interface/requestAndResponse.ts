import Article from "./article.model";
import IFile from "./file";
import User from "./user.model";

export interface SignInRequest {
  username: string;
  password: string;
}

export type SignInResponse = {
  authenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  error: {
    title: string | null;
    description: string | null;
  };
};

export interface SignUpRequest {
  displayName: string;
  aliases: string;
  sex?: number;
  degree: string;
  workPlace: string;
  nation: string;
  backgroundInfomation?: string;
  email: string;
  username: string;
  password: string;
  rePassword: string;
  photoURL?: string;
}

export interface SignUpResponse {
  success: boolean;
  data: User;
}

export interface AuthInfoResponse {
  status: number;
  message: string | null;
  message_vn: string | null;
  success: boolean;
  data: User;
}

export interface ResetPasswordRequest {
  userId: string;
  token: string;
  password: string;
}

export interface NewJournalRequest {
  journalGroup: string;
  name: string;
  tags?: string[];
  description?: string;
  editors: { _id: number; name: string }[];
}

export interface NewJournalGroupRequest {
  name: string;
  tags?: string[];
}

export interface NewSubmissionRequest {
  journalGroup: {
    _id: string;
    name: string;
  };
  journalId: string;
  language: string;
  tags: string[];
  authors: {
    main: {
      _id: string;
      displayName: string;
      photoURL?: string;
      workPlace?: string;
      backgroundInfomation?: string;
    };
    sub?: {
      displayName: string;
      email: string;
      workPlace?: string;
      backgroundInfomation?: string;
    }[];
  };
  title: string;
  abstract: string;
  detail: {
    submission: {
      file?: IFile;
      messageToEditor: string;
      orcid?: string;
      website?: string;
      helperFiles: IFile[];
    };
  };
}

export interface RequestReviewerRequest {
  _id: string | undefined;
  importantDates: {
    responseDueDate: Date | null;
    reviewDueDate: Date | null;
  };
  reviewer: string;
  displayFile?: IFile;
  files?: IFile[];
}

export interface ReviewSubmitRequest {
  _id?: string;
  _roundId?: string;
  commentForEditors?: string;
  commentForEveryone?: string;
  files: IFile[];
  recommendations: string;
  otherRecommendation?: string;
}
