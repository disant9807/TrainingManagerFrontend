import { TOrder } from '@/types/globals';
import Api from '@/api';
import { BaseController } from './BaseController';
import { SUCCESS_CODES, TResult } from '@/api/baseApi';
import { TCategoryOfBody } from '@/controllers/CategoryOfBodyController';
import { TUnitsOfMeasurement } from './UnitsOfMeasurementController';

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
  userId: string;
  isEveryone: boolean;
  name: string;
  createdDate: string;
  sizeItems: Array<TSizeItem>;
  isArchived: boolean;
  constructor() {
    this.id = '';
    this.userId = '';
    this.isEveryone = false;
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
  body?: TCategoryOfBody;
  value: string;
  codeUnitsOfMeasurement: string;
  unitsOfMeasurement?: TUnitsOfMeasurement;
  avatarId: string;
  constructor() {
    this.id = '';
    this.sizeId = '';
    this.bodyCode = '';
    this.body = new TCategoryOfBody();
    this.value = '';
    this.codeUnitsOfMeasurement = '';
    this.unitsOfMeasurement = new TUnitsOfMeasurement();
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

  async GetSize(filter: TSizeFilterViewModel, order: TOrder, userId: string): Promise<TResult<TSize[]>> {
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

    return await sizeApi.GetSize(filterModel, userId);
  }
}

const SizeController = new SizeModel();
export default SizeController;
