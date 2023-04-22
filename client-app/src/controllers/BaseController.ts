export class BaseController {
  public async handleAndResolve(func: () => Promise<any>) {
    const response = await this.handle(func);
    return this.resolve(response, response.data);
  }

  private async handle(callback: () => Promise<any>): Promise<any> {
    try {
      return await callback();
    } catch (error) {
      return Promise.reject({ error, success: false });
    }
  }

  private async resolve(response: any, data?: any): Promise<any> {
    if (response.success) return Promise.resolve(data ?? response);
    else throw new Error(response.error);
  }
}
