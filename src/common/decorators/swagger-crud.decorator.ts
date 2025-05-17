import { applyDecorators, Type } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function SwaggerCreate(summary: string, dto: Type) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiResponse({ status: 201, type: dto }),
  );
}

export function SwaggerFindAll(summary: string, dto: Type) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiResponse({ status: 200, type: [dto] }),
  );
}

export function SwaggerFindOne(summary: string, dto: Type) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiResponse({ status: 200, type: dto }),
  );
}

export function SwaggerUpdate(summary: string, dto: Type) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiResponse({ status: 200, type: dto }),
  );
}

export function SwaggerDelete(summary: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiResponse({ status: 200, schema: { example: { deleted: true } } }),
  );
}
