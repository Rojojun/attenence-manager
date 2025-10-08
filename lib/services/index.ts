// Export all services from a single entry point
export { programsService } from './programs';
export { participantsService } from './participants';
export { attendanceService } from './attendance';
export { giftsService } from './gifts';
export { exportService } from './export';

// Re-export types for convenience
export type * from '../types';
