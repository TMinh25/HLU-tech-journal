import { ArticleStatus, AttendedRole } from "../types";

export default interface User {
  _id: string;
  /** Họ và tên hiển thị của người dùng */
  displayName: string;
  /** GetStream.io token */
  streamToken: string;
  /** Bí danh */
<<<<<<< HEAD
  aliases?: string;
=======
  aliases: string;
>>>>>>> 165182b955d19798f8d3fd92cb4876eb916f0780
  /** Giới tính
   * ```js
   * 0 = "nữ"
   * 1 = "nam"
   * null = "không xác định"
   * ```
   */
  sex: number;
  /** Quyền của người dùng
   * ```js
   * 0 = "ADMIN"
   * 1 = "Ban biên tập"
   * 2 = "Phản biện"
   * 3 = "Người dùng"
   * ```
   */
  role: number;
  /** Bằng cấp */
  degree: string;
  /** Nơi làm việc */
  workPlace: string;
  /** Quốc gia */
  nation: string;
  /** Thông tin background của người dùng, thông tin thêm */
  backgroundInfomation: string;
  /** Email của người dùng đăng kí */
  email: string;
  /** Tên đăng nhập của người dùng */
  username: string;
  /** Mật khẩu đã mã hóa */
  password: string;
  /** Link ảnh đại diện */
  photoURL: string;
  /** Tài khoản người dùng bị khóa */
  disabled: boolean;
  /** Tài khoản đã xác thực */
  verified: boolean;
  /** Cài đặt của người dùng */
  userSetting: {
    theme: string;
    language: string;
    forReviewer: {
      acceptingReview: false;
      reviewField: string[];
    };
    forReader: {
      acceptingEmail: true;
      acceptingNotification: true;
    };
  };
  /** Ngày tạo tài khoản */
  createdAt: Date;
  /** Ngày cập nhật */
  updatedAt: Date;
}

export interface TempReviewer {
  displayName: string;
  tags?: string[];
  email: string;
}
