import { TOrder } from '@/types/globals';
import Api from '@/api';
import { BaseController } from './BaseController';
import { SUCCESS_CODES, TResult } from '@/api/baseApi';

const sizeApi = Api.getSizeApi();

export type TSizeFilterViewModel = {
  categoryOfBodies?: string[],
  name?: string,
  period?: string[];
  codeUnitsOfMeasurement?: string[],
  createdFrom?: string,
  createdTo?: string
}

export type TSizeFilterModel = {
  categoryOfBodies?: string[],
  codeUnitsOfMeasurement?: string[],
  name?: string,
  createdFrom?: string;
  createdTo?: string;
  order: TOrder,
  start?: string,
  count?: string
}

export class TSize {
  id: string;
  name: string;
  createdDate: string;
  sizeItems: Array<TSizeItem>;
  isArchived: boolean;
  constructor() {
    this.id = '';
    this.name = '';
    this.createdDate = '';
    this.sizeItems = [];
    this.isArchived = false;
  }
}

export class TSizeItem {
  id: string;
  sizeId: string;
  bodyCode: string;
  value: string;
  codeUnitsOfMeasurement: string;
  avatarId: string;
  constructor() {
    this.id = '';
    this.sizeId = '';
    this.bodyCode = '';
    this.value = '';
    this.codeUnitsOfMeasurement = '';
    this.avatarId = '';
  }
}

class SizeModel extends BaseController {
  async ArchiveSize(id: string, status: boolean) {
    return await this.handleAndResolve(() => sizeApi.ArchiveSize(id, status));
  }

  async CreateSize(size: TSize) {
    return await this.handleAndResolve(() => sizeApi.CreateSize(size));
  }

  async UpdateSize(id: string, size: TSize) {
    return await this.handleAndResolve(() => sizeApi.UpdateSize(size));
  }

  async GetSizeById(id: string): Promise<TSize> {
    return await this.handleAndResolve(() => sizeApi.GetSizeById(id));
  }

  async GetSize(filter: TSizeFilterViewModel, order: TOrder): Promise<TResult<TSize[]>> {
    const { categoryOfBodies, name, period, codeUnitsOfMeasurement } = filter;
    const [createdFrom, createdTo] = period || [];

    const filterModel: TSizeFilterModel | undefined = {
      codeUnitsOfMeasurement: codeUnitsOfMeasurement ?? [],
      categoryOfBodies: categoryOfBodies ?? [],
      name,
      createdFrom,
      createdTo,
      order
    };

    return await sizeApi.GetSize(filterModel);
  }
}

const SizeController = new SizeModel();
export default SizeController;
