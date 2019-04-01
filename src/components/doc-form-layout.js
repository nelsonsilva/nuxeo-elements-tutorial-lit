/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { LitElement, html } from '@polymer/lit-element';
import '@polymer/iron-form/iron-form.js';
import '@polymer/paper-button/paper-button.js';
import '@nuxeo/nuxeo-elements/nuxeo-document.js';
import './doc-layout.js';

// XXX: see if extending DocumentLayoutElement would be cleaner
export class DocumentFormLayoutElement extends LitElement {

  render() {
    const { document, headers, layout, i18n } = this;
    return html`
      <style>
      </style>

      <nuxeo-document id="doc" doc-id="${document.uid}" @response="{{document}}" .headers="${headers}" sync-indexing></nuxeo-document>

      <iron-form id="form">
        <form>
          <div class="scrollable">
            <nuxeo-document-layout id="layout" .document="${document}" .layout="${layout}" @document-changed=${this._documentChanged}></nuxeo-document-layout>
          </div>
          <div class="actions">
            <paper-button @tap="${this.cancel}" noink>${i18n('command.cancel')}</paper-button>
            <paper-button id="save" @tap="${this.save}" noink class="primary">${i18n('command.save')}</paper-button>
          </div>
        </form>
      </iron-form>
    `;
  }

  static get properties() {
    return {
      _document: { type: Object },
      layout: { type: String },
      headers: { type: Object }
    }
  }

  constructor() {
    super();
  }

  // Only render if there's a document
  shouldUpdate() {
    return this.document;
  }

  i18n(key) {
    return key;
  }

  get formElement() {
    return this.shadowRoot.getElementById('form');
  }

  get layoutElement() {
    return this.shadowRoot.getElementById('layout');
  }

  _validateForm() {
    // run our custom validation function first to allow setting custom native validity
    var result = this.layoutElement.validate() && this.formElement.validate();
    if (result) {
      return result;
    } else {
      var layout = this.$.layout.$.layout;
      var nodes = layout._getValidatableElements(layout.element.root);
      var invalidField = nodes.find(function(node) {
        return node.invalid;
      });
      invalidField.scrollIntoView();
      invalidField.focus();
    }
  }

  _doSave() {
    const request = this.shadowRoot.getElementById('doc');
    
    if (!this.document.uid) { // create
      request.data = this.document;
      return request.post()
    } else { // edit
      request.data = {
        'entity-type': 'document',
        uid: this.document.uid,
        properties: this._dirtyProperties
      };
      return request.put();
    }
  }

  save() {
    if (!this._validateForm()) {
      return;
    }
    this._doSave().then(this._refresh.bind(this), function(err) {
      this.fire('notify', {message: this.i18n('document.saveError')});
      console.error(err);
    }.bind(this));
  }

  cancel() {
    this._refresh();
    this.document = undefined;
  }

  _refresh() {
    this.fire('document-updated');
  }

  _documentChanged(e) {
    if (e.path === 'document') {
      this._dirtyProperties = {};
    } else {
      // copy dirty properties (cannot patch complex or list properties)
      var match = e.path.match(/^document\.properties\.([^\.]*)/);
      if (match) {
        var prop = match[1];
        this._dirtyProperties[prop] = this.document.properties[prop];
      }
    }
  }

}

window.customElements.define('nuxeo-document-form-layout', DocumentFormLayoutElement);