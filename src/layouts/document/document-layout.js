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

/**
 * Base class for all layout elements
 */
export class DocumentLayout extends LitElement {
  static get properties() {
    return {
      document: { type: Object }
    }
  }
  constructor() {
    super();
  }

  // Only render if there's a document
  shouldUpdate() {
    return this.document;
  }

  static get properties() { return {
    document: { type: Object }
  }};

  i18n(key) {
    return key;
  }

  validate() {
    return true;
  }
  
  /**
   * XXX: this will use document.get(...) in the future
   */
  _get(propertyName) {
    return this.document && this.document.properties[propertyName];
  }

  // XXX: this will use document.set(...) in the future
  _set(prop, value) {
    this.document.properties[prop] = value;
    this.dispatchEvent(new CustomEvent('document-changed', {
        detail: {
          value: this.document,
          path: `document.properties.${prop}`,
          bubbles: true
        }
      }));
  }
}
