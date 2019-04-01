/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { LitElement } from '@polymer/lit-element';

export class DocumentLayoutElement extends LitElement {
  static get properties() {
    return {
      _document: { type: Object },
      _layout: { type: String }
    }
  }

  constructor() {
    super();
  }

  // Only render this page if there's a document
  shouldUpdate() {
    return this.document && this.layout;
  } 

  _updateLayout() {
    const doc = this.document;
    const name = `nuxeo-${doc.type.toLowerCase()}-metadata-layout`;
    this.element = document.createElement(name);
    const { element, renderRoot } = this;
    if (renderRoot.hasChildNodes()) {
      renderRoot.replaceChild(element, renderRoot.firstChild);
    } else {
      renderRoot.appendChild(element);
    }
    import(`../layouts/document/${doc.type.toLowerCase()}/${name}`).then(({ default: _ }) => {
      element.document = this.document;
    }); //.catch(error => 'An error occurred while loading the layout');
  }

  set layout(layout) {
    this._layout = layout;
    this._updateLayout();
  }

  get layout() {
    return this._layout;
  }

  set document(doc) {
    this._document = doc;
    this._updateLayout();
  }

  get document() {
    return this._document;
  }
}

window.customElements.define('nuxeo-document-layout', DocumentLayoutElement);