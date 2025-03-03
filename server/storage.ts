// This file now only handles in-memory processing
// No database storage is used as per requirements

export interface IStorage {
  // Empty interface as we don't need storage operations
  // All processing is done in memory
}

export class MemStorage implements IStorage {
  constructor() {
    // Initialize empty memory storage if needed in the future
  }
}

export const storage = new MemStorage();