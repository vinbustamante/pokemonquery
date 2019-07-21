export interface IFlowService {
  each(items: any[], handler, parallelCount?: number): Promise<any[]>;
}
