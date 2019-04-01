import { html } from '@polymer/lit-element';
import '@nuxeo/nuxeo-ui-elements/widgets/nuxeo-date'
import '@nuxeo/nuxeo-ui-elements/widgets/nuxeo-directory-suggestion'
import { DocumentLayout } from '../document-layout';

class WorkspaceMetadataLayout extends DocumentLayout {
  render() {
    const { i18n, formatDirectory } = this;
    return html`
      <style>
        *[role=widget] {
          margin-bottom: 16px;
        }

        label {
          @apply --nuxeo-label;
        }
      </style>

      <div role="widget">
        <label>${i18n('label.dublincore.title')}</label>
        <div name="title">${this._get("dc:title")}</div>
      </div>

      <div role="widget" ?hidden="${!this._get("dc:description")}">
        <label>${i18n('label.dublincore.description')}</label>
        <div name="description" class="multiline">${this._get("dc:description")}</div>
      </div>

      <div role="widget" ?hidden="${!this._get("dc:nature")}">
        <label>${i18n('label.dublincore.nature')}</label>
        <div name="nature">${formatDirectory(this._get("dc:nature"))}</div>
      </div>

      <nuxeo-directory-suggestion role="widget"
                                  label="${i18n('label.dublincore.subjects')}"
                                  directory-name="l10nsubjects"
                                  name="subjects"
                                  .value="${this._get("dc:subjects")}"
                                  ?hidden="${!this._get("dc:subjects").length}"
                                  multiple
                                  dbl10n
                                  readonly>
      </nuxeo-directory-suggestion>

      <div role="widget" ?hidden="${!this._get("dc:coverage")}">
        <label>${i18n('label.dublincore.coverage')}</label>
        <div name="coverage">${formatDirectory(this._get("dc:coverage"))}</div>
      </div>
    `;
  }

  constructor() {
    super();
  }

  formatDirectory(entry) {
    return entry && entry.label;
  }
}

window.customElements.define('nuxeo-workspace-metadata-layout', WorkspaceMetadataLayout);
