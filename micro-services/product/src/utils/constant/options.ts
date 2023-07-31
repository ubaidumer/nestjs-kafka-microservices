import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

// Product options fields
export class Options {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsBoolean()
  @IsNotEmpty()
  isRequired: boolean;

  @IsBoolean()
  @IsNotEmpty()
  isMultiSelectable: boolean;

  @IsArray()
  @IsOptional()
  @ValidateNested()
  variations: variation[];
}

// Product variation fields
export class variation {
  @IsString()
  name: string;

  @IsNumber()
  @IsOptional()
  price: number;
}
