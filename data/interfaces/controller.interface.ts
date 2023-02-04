export interface Controller<T, U> {
  create(data: T): Promise<U>;
  getById(id: string): Promise<U>;
  getAll(): Promise<U[]>;
  update(id: string, data: T): Promise<void>;
  delete(id: string): Promise<void>;
}
