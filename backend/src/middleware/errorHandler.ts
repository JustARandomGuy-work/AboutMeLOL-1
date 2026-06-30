import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: 'Validation error', details: err.message });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (err.status === 404) {
    return res.status(404).json({ error: 'Not found' });
  }

  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    code: err.code
  });
};

export default errorHandler;
