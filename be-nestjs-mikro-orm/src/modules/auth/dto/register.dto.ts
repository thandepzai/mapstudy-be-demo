import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsNumber,
  IsString,
  IsIn,
} from 'class-validator';

export class RegisterDto {
  @MinLength(3, { message: 'Tên phải có ít nhất 3 ký tự' })
  @IsString({ message: 'Tên người dùng phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Họ và tên không được để trống' })
  fullName!: string;

  @MinLength(3, { message: 'Tên tài khoản phải có ít nhất 3 ký tự' })
  @IsString({ message: 'Tên tài khoản phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Tên tài khoản không được để trống' })
  username!: string;

  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  @IsString({ message: 'Mật khẩu phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  password!: string;

  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @IsString({ message: 'Email phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email!: string;

  @IsString({ message: 'Số điện thoại phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  phone!: string;

  @IsIn([0, 1], { message: 'Giới tính phải là 0 (nữ) hoặc 1 (nam)' })
  @IsNotEmpty({ message: 'Giới tính không được để trống' })
  gender!: number;

  @IsNumber({}, { message: 'Năm sinh phải là số' })
  @IsNotEmpty({ message: 'Năm sinh không được để trống' })
  birthYear!: number;

  @IsString({ message: 'Link Facebook phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Link Facebook không được để trống' })
  facebookLink!: string;

  @IsString({ message: 'Tỉnh/thành phố phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Tỉnh/thành phố không được để trống' })
  province!: string;

  @IsString({ message: 'Tên trường phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Tên trường không được để trống' })
  school!: string;
}
