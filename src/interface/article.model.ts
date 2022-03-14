import { AttendedRole, ReviewStatus } from "../types";
import IFile from "./file";

export default interface Article {
  _id: string;
  title: string;
  journal: {
    _id: string;
    name: string;
  };
  journalGroup: {
    _id: string;
    name: string;
  };
  abstract?: string;
  authors: {
    main: {
      _id: string;
      displayName: string;
      email: string;
      workPlace: string;
      backgroundInfomation: string;
      photoURL: string;
    };
    sub: {
      displayName: string;
      email: string;
      workPlace?: string;
      backgroundInfomation?: string;
    }[];
  };
  tags?: string[];
  language: string;
  /**
   * submission: Nộp bản thảo
   * review: Tìm phản biện và đánh giá bản thảo
   * publishing: Hoàn thiện bản thảo và đang xuất bản
   * completed: Xuất bản
   */
  status: string;
  visible: boolean;
  detail?: {
    reject?: {
      reason: string;
      notes: string;
    };
    submission: {
      file: IFile;
      messageToEditor?: string;
      orcid?: string;
      website?: string;
      helperFiles?: IFile[];
    };
    review?: ReviewRoundObject[];
    publishing: {
      draftFile?: IFile[];
      request: {
        _id?: string;
        text?: string;
        files: IFile[];
        responseFile?: IFile;
      }[];
    };
  };
  files: IFile[];
  reviewer?: string[];
  publishedFile?: IFile;
  publishedAt?: Date;
  contributors?: Contributor[];
  createdAt: Date;
  updatedAt: Date;
  discussions: Discussion[];
  currentFile?: IFile;
}

export interface Discussion {
  from: string;
  to: string;
  message?: string;
  files?: IFile[];
  at: Date;
  seen: boolean;
}

export interface Contributor {
  _id: string;
  role: AttendedRole;
}

export interface ReviewRoundObject {
  _id: string;
  status: ReviewStatus;
  importantDates: {
    createdAt: Date;
    responseDueDate: Date;
    reviewDueDate: Date;
  };
  reviewer: string;
  editor: string;
  displayFile?: IFile;
  files?: IFile[];
  result?: {
    commentForEditors?: string;
    commentForEveryone?: string;
    files: IFile[];
    recommendations: string;
    otherRecommendation: string;
    submittedAt: Date;
  };
  guideLines: string;
  reject?: {
    reason: string;
    notes: string;
  };
}
