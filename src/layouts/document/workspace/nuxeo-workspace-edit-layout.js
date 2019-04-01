import { LitElement, html } from '@polymer/lit-element';
import '@nuxeo/nuxeo-ui-elements/widgets/nuxeo-input'
import '@nuxeo/nuxeo-ui-elements/widgets/nuxeo-directory-suggestion'
import '@nuxeo/nuxeo-ui-elements/widgets/nuxeo-textarea'
import { DocumentLayout } from '../document-layout';

class WorkspaceEditLayout extends DocumentLayout {

  constructor() {
    super();
  }

  render() {
    const { i18n } = this;
    return html`
      <style>
        *[role=widget] {
          margin-bottom: 8px;
        }
      </style>

      <nuxeo-input role="widget"
                  label="${i18n('title')}"
                  name="title"
                  .value="${this._get('dc:title')}"
                  @value-changed="${(e) => this._set('dc:title', e.detail.value)}"
                  autofocus required>
      </nuxeo-input>

      <nuxeo-textarea role="widget"
                      label="${i18n('label.description')}"
                      name="description"
                      .value="${this._get('dc:description')}">
      </nuxeo-textarea>

      <nuxeo-directory-suggestion role="widget" label="${i18n('label.dublincore.nature')}"
                                  name="nature"
                                  directory-name="nature"
                                  .value="${this._get('dc:nature')}"
                                  placeholder="${i18n('dublincoreEdit.directorySuggestion.placeholder')}"
                                  min-chars="0">
      </nuxeo-directory-suggestion>

      <nuxeo-directory-suggestion role="widget" label="${i18n('label.dublincore.subjects')}"
                                  directory-name="l10nsubjects"
                                  name="subjects"
                                  .value="${this._get('dc:subjects')}"
                                  multiple="true"
                                  dbl10n="true"
                                  placeholder="${i18n('dublincoreEdit.directorySuggestion.placeholder')}"
                                  min-chars="0">
      </nuxeo-directory-suggestion>

      <nuxeo-directory-suggestion role="widget" label="${i18n('label.dublincore.coverage')}"
                                  directory-name="l10ncoverage"
                                  name="coverage"
                                  .value="${this._get('dc:coverage')}"
                                  dbl10n="true"
                                  placeholder="${i18n('dublincoreEdit.directorySuggestion.placeholder')}"
                                  min-chars="0">
      </nuxeo-directory-suggestion>
    `;
  }
}

window.customElements.define('nuxeo-workspace-edit-layout', WorkspaceEditLayout);
