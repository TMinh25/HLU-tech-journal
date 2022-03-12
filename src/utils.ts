import {
  ArticleStatus,
  AttendedRole,
  ReviewResult,
  ReviewStatus,
  Role,
} from "./types";

import countries from "./data/countryCode.json";

export function toRoleString(role: Role | string | number | undefined): string {
  switch (role) {
    case 1:
    case Role.admin:
      return "Quản trị viên";
    case 2:
    case Role.editors:
      return "Ban Biên Tập";
    case 3:
    case Role.reviewers:
      return "Phản Biện";
    default:
      return "Người Dùng";
  }
}

export function toArticleStatusString(
  status: String | ArticleStatus | undefined
): string {
  switch (status) {
    case ArticleStatus.reject:
    case "reject":
      return "Đã từ chối";
    case ArticleStatus.review:
    case "review":
      return "Đang đánh giá";
    case ArticleStatus.publishing:
    case "publishing":
      return "Đang xuất bản";
    case ArticleStatus.completed:
    case "completed":
      return "Hoàn tất";
    case ArticleStatus.submission:
    case "submission":
    default:
      return "Đã nộp bản thảo";
  }
}

export function getArticleStatusType(
  status: String | ArticleStatus | undefined
) {
  switch (status) {
    case ArticleStatus.reject:
      return "error";
    case ArticleStatus.completed:
      return "success";
    case ArticleStatus.review:
    case ArticleStatus.publishing:
    case ArticleStatus.submission:
      return "warning";
    default:
      return "info";
  }
}

export function toReviewStatusString(
  status: String | ReviewStatus | undefined
): string {
  switch (status) {
    case ReviewStatus.unassign:
      return "Chưa có phản biện";
    case ReviewStatus.unassigned:
      return "Vòng phản biện đã bị gỡ";
    case ReviewStatus.request:
      return "Đã yêu cầu phản biện";
    case ReviewStatus.requestRejected:
      return "Phản biện từ chối đánh giá";
    case ReviewStatus.reviewing:
      return "Đang đánh giá";
    case ReviewStatus.reviewSubmitted:
      return "Đã gửi đánh giá";
    case ReviewStatus.denied:
      return "Đánh giá không được chấp nhận";
    case ReviewStatus.confirmed:
    default:
      return "Hoàn tất";
  }
}

export function getReviewStatusType(status: ReviewStatus | string | undefined) {
  switch (status) {
    case ReviewStatus.requestRejected:
    case ReviewStatus.denied:
    case ReviewStatus.unassigned:
      return "error";
    case ReviewStatus.unassign:
    case ReviewStatus.request:
    case ReviewStatus.reviewing:
      return "warning";
    case ReviewStatus.reviewSubmitted:
    case ReviewStatus.confirmed:
      return "success";
    default:
      return "info";
  }
}

export function toResultRecommendationString(
  result: String | ReviewResult | undefined
): string {
  switch (result) {
    case ReviewResult.accepted:
      return "Chấp nhận bản thảo";
    case ReviewResult.declined:
      return "Từ chối bản thảo";
    case ReviewResult.resubmission:
      return "Không đúng chuyên san";
    case ReviewResult.resubmit:
      return "Gửi lại bản thảo sau khi hoàn thiện hơn";
    case ReviewResult.revision:
      return "Chỉnh sửa một số chi tiết nhỏ";
    case ReviewResult.other:
    default:
      return "Khác";
  }
}

export function getReviewResultType(status: ReviewResult | string) {
  switch (status) {
    case ReviewResult.declined:
      return "error";
    case ReviewResult.accepted:
      return "success";
    case ReviewResult.resubmit:
    case ReviewResult.revision:
    case ReviewResult.other:
      return "warning";
    case ReviewResult.resubmission:
    default:
      return "info";
  }
}
export function toAttendedRoleSrting(role: AttendedRole | string) {
  switch (role) {
    case AttendedRole.author:
      return "Tác giả";
    case AttendedRole.editor:
      return "Ban biên tập";
    case AttendedRole.reviewer:
      return "Phản biện";
    default:
      return "";
  }
}

export async function copyTextToClipboard(text: string) {
  return await navigator.clipboard.writeText(text);
}

export function getCountryName(slug: string): string | undefined {
  return countries.find((country) => country.slug === slug)?.name;
}
