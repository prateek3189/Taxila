import type { Request, Response } from 'express';
import { AppError } from '../lib/AppError';

export function notFoundHandler(_req: Request, _res: Response, next: (err: AppError) => void) {
  next(new AppError(404, 'NOT_FOUND', 'Resource not found'));
}
