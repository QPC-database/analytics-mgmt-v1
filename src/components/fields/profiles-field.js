import SelectField from './select-field';
import events from '../../config/events';

class ProfilesField extends SelectField {
  constructor(field, formControl) {
    super(field, formControl);

    this.className = 'Profiles';

    this.handleChange((i, elem) => {
      this.formControl.emit(events.FIELDS.PROFILES.CHANGE, {
        i: i,
        elem: elem
      });
    });

    this.formControl.on(events.FIELDS.ACCOUNTS.CHANGE, (event) => {
      this.empty();
    });

    this.formControl.on(events.FIELDS.PROPERTIES.CHANGE, (event) => {
      this.empty();

      if (event.elem) {
        this.init(
          $(event.elem).data('accountId'),
          $(event.elem).val(),
          $(event.elem).text().replace('---', '')
        );
      }
    });
  }

  init(accountId, propertyId, propertyName) {
    super.init();

    this.showLoader();
    gapi.client.analytics.management.profiles.list({
      'accountId': accountId,
      'webPropertyId': propertyId
    })
    .then((response) => {
      response.parentName = propertyName;
      this.handleResult(response);
      this.hideLoader();
    })
    .then(null, (err) => {
      this.handleError(`${propertyName}: ${err}`);
      this.hideLoader();
    });
  }

  handleResult(response) {
    super.handleResult(
      response.result.items,
      this.field,
      'name',
      'id',
      ['accountId'],
      this.translate.analytics.errors[`no${this.className}`],
      {
        parentName: "---",
        group: {
          name: response.parentName
        }
      }
    );
  }
}

export default ProfilesField;
