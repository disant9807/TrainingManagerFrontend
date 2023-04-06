import { TOrder } from '@/types/globals';
import Api from '@/api';
import { BaseController } from './BaseController';
import { SUCCESS_CODES, TResult } from '@/api/baseApi';

const categoryOfBodyApi = Api.getCategoryOfBodyApi();

export type TCategoryOfBodyFilterViewModel = {
  queryString?: string,
}

export type TCategoryOfBodyFilterModel = {
  queryString?: string,
  order?: TOrder,
  start?: string,
  count?: string
}

export class TCategoryOfBody {
  code: string;
  name: string;
  shortName: string;
  decsription: string;
  isArchived: boolean;
  constructor() {
    this.code = '';
    this.name = '';
    this.shortName = '';
    this.decsription = '';
    this.isArchived = false;
  }
}

class CategoryOfBodyModel extends BaseController {
  async ArchiveCategoryOfBody(code: string, state: boolean) {
    return await this.handleAndResolve(() => categoryOfBodyApi.ArchiveCategoryOfBodyApi(code, state));
  }

  async CreateCategoryOfBody(categoryOfBody: TCategoryOfBody) {
    return await this.handleAndResolve(() => categoryOfBodyApi.CreateCategoryOfBody(categoryOfBody));
  }

  async UpdateCategoryOfBody(code: string, categoryOfBody: TCategoryOfBody) {
    return await this.handleAndResolve(() => categoryOfBodyApi.UpdateCategoryOfBody(code, categoryOfBody));
  }

  async GetCategoryOfBodyById(code: string): Promise<TCategoryOfBody> {
    return await this.handleAndResolve(() => categoryOfBodyApi.GetCategoryOfBodyById(code));
  }

  async GetCategoryOfBody(filter: TCategoryOfBodyFilterModel): Promise<TResult<TCategoryOfBody[]>> {
    const filterModel: TCategoryOfBodyFilterModel | undefined = {
      queryString: filter.queryString
    };

    return await categoryOfBodyApi.GetCategoryOfBody(filterModel);
  }
}

const CategoryOfBodyController = new CategoryOfBodyModel();
export default CategoryOfBodyController;
