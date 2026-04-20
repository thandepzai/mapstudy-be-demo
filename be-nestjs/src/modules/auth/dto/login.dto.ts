import { IsNotEmpty, MinLength, IsString } from 'class-validator';

export class LoginDto {
  @MinLength(3, { message: 'Tên tài khoản phải có ít nhất 3 ký tự' })
  @IsString({ message: 'Tên tài khoản phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Tên tài khoản không được để trống' })
  username: string;

  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  @IsString({ message: 'Mật khẩu phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  password: string;
}
