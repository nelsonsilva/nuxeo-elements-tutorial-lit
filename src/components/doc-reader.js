import { html } from '@polymer/lit-element';
import { PageViewElement } from './page-view-element.js';
import '@nuxeo/nuxeo-elements/nuxeo-connection'
import '@nuxeo/nuxeo-elements/nuxeo-document'
import '@nuxeo/nuxeo-elements/nuxeo-page-provider'
import '@nuxeo/nuxeo-ui-elements/widgets/nuxeo-file'
import '@nuxeo/nuxeo-ui-elements/widgets/nuxeo-document-suggestion'
import './nuxeo-documents-table'

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';

class DocReader extends PageViewElement {
  render() {
    const { path, doc, params, children } = this;
    const contributors = doc && doc.properties['dc:contributors'];
    const isFolderish = doc && doc.facets.indexOf('Folderish') != -1;
    const router = {
      browse: () => '#'
    };

    return html`
      ${SharedStyles}
      <nuxeo-connection url="http://localhost:8080/nuxeo"></nuxeo-connection>

      <nuxeo-document-suggestion
                      .router="${router}"
                      placeholder="Select a document"
                      @selected-item-changed="${(e) => this._select(e.detail.value)}">
      </nuxeo-document-suggestion>

      <nuxeo-document auto
                  doc-path="${path}"
                  @response-changed="${(e) => this.doc = e.detail.value}"></nuxeo-document>

      <nuxeo-page-provider auto
                      id="pp"
                      provider="advanced_document_content"
                      enrichers="thumbnail"
                      .params="${params}"
                      @current-page-changed="${(e) => this.children = e.detail.value}">
      </nuxeo-page-provider>

      ${doc ? 
        html`
        <h2>Title: ${doc.title}</h2>
        <p>ID: ${doc.uid}</p>
        <p>Repository: ${doc.repository}</p>
        <p>State: ${doc.state}</p>

        <h3>Contributors:</h3>
        <ul>
          ${contributors.map((contributor) => html`<li>${contributor}</li>`)}
        </ul>

        ${isFolderish ?
          html`
          <div class="flex">
            <h3>Upload files:</h3>
            <nuxeo-file @value-changed="${this.importFile}"></nuxeo-file>
          </div>
          <h3>Children:</h3>
          <nuxeo-documents-table .documents="${children}"></nuxeo-documents-table>
        `: ''}`
      : ''}
    `;
  }

  static get properties() { return {
    docPath: { type: String },
    doc: { type: Object },
    children: { type: Array },
    params: { type: Object }
  }}

  constructor() {
    super();
    this.path = '';
    this.params = {};
  }

  importFile(event) {
    const context = {currentDocument: this.path};
    event.target
      .batchExecute('FileManager.Import', { context }, { nx_es_sync: 'true' })
      .then(() => event.target.value = undefined)
      .then(() => this.querySelector('#pp').fetch());
  }

  _select(doc) {
    if (doc) {
      this.path = doc.path;
      this.params = { ecm_parentId: doc.uid };
    } else {
      this.path = '';
      this.doc = undefined;
      this.params = {};
    }
  }
}

window.customElements.define('doc-reader', DocReader);
