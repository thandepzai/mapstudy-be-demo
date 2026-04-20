import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class RefreshTokenDto {
  @IsNumber({}, { message: 'Id phải là số' })
  @IsNotEmpty({ message: 'Id không được để trống' })
  userId: number;

  @IsString({ message: 'Refresh Token phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Refresh Token không được để trống' })
  refreshToken: string;
}
