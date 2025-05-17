import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

export function SwaggerCreate(summary: string, dto: Type) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiResponse({ status: 201, type: dto }),
    ApiNotFoundResponse({ description: 'Resource not found' }),
  );
}

export function SwaggerFindAll(summary: string, dto: Type) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiOkResponse({ type: [dto] }),
  );
}

export function SwaggerFindOne(summary: string, dto: Type) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiOkResponse({ type: dto }),
    ApiNotFoundResponse({ description: 'Resource not found' }),
  );
}

export function SwaggerUpdate(summary: string, dto: Type) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiOkResponse({ type: dto }),
    ApiNotFoundResponse({ description: 'Resource not found' }),
  );
}

export function SwaggerDelete(summary: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiOkResponse({ schema: { example: { deleted: true } } }),
    ApiNotFoundResponse({ description: 'Resource not found' }),
  );
}
