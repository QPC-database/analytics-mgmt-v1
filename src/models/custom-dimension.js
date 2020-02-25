import ModelBase from './model-base';
import ui from '../config/ui';

class CustomDimension extends ModelBase {
  constructor(customDimension = {}) {
    super();
    this.index = customDimension.index
    this.name = customDimension.name;
    this.scope = customDimension.scope;
    this.active = customDimension.active;
    this.accountId = customDimension.accountId;
    this.webPropertyId = customDimension.webPropertyId;
  }

  static async all(accountId, webPropertyId) {
    return await gapi.client.analytics.management.customDimensions.list({
      accountId: accountId,
      webPropertyId: webPropertyId
    }).then((response) => {
      return response.result.items.map((item) => {
        return new CustomDimension(item);
      })
    }).catch((err) => {
      console.log(err);
      return err;
    });
  }

  static async find(accountId, webPropertyId, index) {
    return await this._api
      .get({
        accountId: accountId,
        webPropertyId: webPropertyId,
        customDimensionId: `ga:dimension${index}`
      })
      .then((response) => {
        return new CustomDimension(response.result);
      })
      .catch((error) => {
        return error;
      });
  }

  static get _api() {
    return gapi.client.analytics.management.customDimensions;
  }

  get _api() {
    return this.constructor._api;
  }

  // NB. Create MUST be triggered squentially - it will not use the index value
  create() {
    return this._api.insert({
      accountId: this.accountId,
      webPropertyId: this.webPropertyId
    }, this.toJson()).then((response) => {
      return new CustomDimension(response.result);
    }).catch((error) => {
      throw new Error(error);
    });
  }

  update(newValues) {
    if (newValues) {
      this.name = newValues.name;
      this.scope = newValues.scope;
      this.active = newValues.active;
    }
    return this._patch(this.toJson())
  }

  destroy() {
    console.log('Custom dimensions cannot be destroyed');
  }

  async activate() {
    return await this._patch({
      active: true
    });
  }

  async deactivate() {
    return await this._patch({
      active: false
    });
  }

  toJson() {
    return {
      name: this.name,
      scope: this.scope,
      active: this.active
    }
  }

  eq(other) {
    if (other == undefined) {
      return false;
    }
    return parseInt(this.index) == parseInt(other.index) &&
           this.name == other.name &&
           this.scope == other.scope &&
           this.active == (other.active == "1");
  }


  _patch(data) {
    return this._api
      .patch({
        accountId: this.accountId,
        webPropertyId: this.webPropertyId,
        customDimensionId: `ga:dimension${this.index}`
      }, data)
      .then((response) => {
        return new CustomDimension(response.result);
      })
  }
}

export default CustomDimension;
