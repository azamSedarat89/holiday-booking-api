import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function SwaggerCreate(entity: string, dto: Type, summary?: string) {
  return applyDecorators(
    ApiOperation({ summary: summary || `Create a new ${entity}` }),
    ApiResponse({ status: 201, type: dto }),
    ApiBadRequestResponse({ description: 'Bad request' }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    ApiNotFoundResponse({ description: `${entity} not found` }),
  );
}

export function SwaggerFindAll(entity: string, dto: Type, summary?: string) {
  return applyDecorators(
    ApiOperation({ summary: summary || `Get all ${entity}s` }),
    ApiOkResponse({
      description: `List of ${entity}s returned successfully`,
      type: [dto],
    }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}

export function SwaggerFindOne(entity: string, dto: Type, summary?: string) {
  return applyDecorators(
    ApiOperation({ summary: summary || `Get ${entity} by ID` }),
    ApiOkResponse({ type: dto }),
    ApiNotFoundResponse({ description: `${entity} not found` }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}

export function SwaggerUpdate(entity: string, dto: Type, summary?: string) {
  return applyDecorators(
    ApiOperation({ summary: summary || `Update a ${entity} by ID` }),
    ApiOkResponse({ type: dto }),
    ApiBadRequestResponse({ description: 'Bad request' }),
    ApiNotFoundResponse({ description: `${entity} not found` }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}

export function SwaggerDelete(entity: string, summary?: string) {
  return applyDecorators(
    ApiOperation({ summary: summary || `Delete a ${entity} by ID` }),
    ApiOkResponse({ schema: { example: { deleted: true } } }),
    ApiNotFoundResponse({ description: `${entity} not found` }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}

export function SwaggerPatch(entity: string, dto: Type, summary?: string) {
  return applyDecorators(
    ApiOperation({ summary: summary ?? `Partially update a ${entity}` }),
    ApiOkResponse({ type: dto }),
    ApiBadRequestResponse({ description: 'Bad request' }),
    ApiNotFoundResponse({ description: `${entity} not found` }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}
