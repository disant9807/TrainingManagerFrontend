import { TOrder } from '@/types/globals';
import Api from '@/api';
import { BaseController } from './BaseController';
import { SUCCESS_CODES, TResult } from '@/api/baseApi';

const unitsOfMeasurementController = Api.GetUnitsOfMeasurementApi();

export type TUnitsOfMeasurementFilterViewModel = {
  queryString?: string,
}

export type TUnitsOfMeasurementFilterModel = {
  queryString?: string,
  order?: TOrder,
  start?: string,
  count?: string
}

export class TUnitsOfMeasurement {
  code: string;
  value: string;
  constructor() {
    this.code = '';
    this.value = '';
  }
}


class UnitsOfMeasurementModel extends BaseController {
  async RemoveUnitsOfMeasurement(code: string) {
    return await this.handleAndResolve(() => unitsOfMeasurementController.RemoveUnitsOfMeasurementApiApi(code));
  }

  async CreateUnitsOfMeasurement(unitsOfMeasurement: TUnitsOfMeasurement) {
    return await this.handleAndResolve(() => unitsOfMeasurementController.CreateUnitsOfMeasurementApi(unitsOfMeasurement));
  }

  async UpdateUnitsOfMeasurement(code: string, unitsOfMeasurement: TUnitsOfMeasurement) {
    return await this.handleAndResolve(() => unitsOfMeasurementController.UpdateUnitsOfMeasurementApi(code, unitsOfMeasurement));
  }

  async GetUnitsOfMeasurementById(code: string): Promise<TUnitsOfMeasurement> {
    return await this.handleAndResolve(() => unitsOfMeasurementController.GetUnitsOfMeasurementApiById(code));
  }

  async GetUnitsOfMeasurement(filter: TUnitsOfMeasurementFilterModel): Promise<TResult<TUnitsOfMeasurement[]>> {
    const filterModel: TUnitsOfMeasurementFilterModel | undefined = {
      queryString: filter.queryString
    };

    return await unitsOfMeasurementController.GetUnitsOfMeasurementApi(filterModel);
  }
}

const UnitsOfMeasurementController = new UnitsOfMeasurementModel();
export default UnitsOfMeasurementController;
