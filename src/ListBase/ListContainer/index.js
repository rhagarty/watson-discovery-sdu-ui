/**
 * Copyright 2017 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License'); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

import React from 'react';
import PropTypes from 'prop-types';
import ListItem from '../ListItem';
import { Container } from 'semantic-ui-react';

/**
 * Item - A checkbox component used to specify a filter item
 * returned by the disco query.
 */
class Item extends ListItem {
  constructor(...props) {
    super(...props);
  }
}

/**
 * FilterContainer - A container component used as a base for
 * containing FilterItems.
 */
class ListContainer extends React.Component {
  constructor(...props) {
    super(...props);
  }

  /**
   * getCollection - Return the object that contains collection
   * of all filter items.
   */
  getCollection() {
    throw new Error('You must implement ListContainer.getCollection!');
  }

  /**
   * getContainerTitle - Return title to be used for filter container.
   */
  getContainerTitle() {
    throw new Error('You must implement ListContainer.getContainerTitle!');
  }

  /**
   * getItemLabel - Filter item label string will consist of the
   * item name along with the number of matches in the current
   * discovery data results.
   */
  getItemLabel(item) {
    return item.key + ' (' + item.matching_results + ')';
  }

  /**
   * getRenderObjectForItem - Return render component that will display the 
   * filter item in the browser.
   */
  getRenderObjectForItem(item) {
    // throw new Error('You must implement FilterContainer.getRenderObjectForItem!');
    return (
      <Item
        label={this.getItemLabel(item)}
        key={this.getItemLabel(item)}
      />
    );
  }

  /**
   * render - Render the filter container and its filter item children.
   */
  render() {
    return (
      <div>
        <Container textAlign='left'>
          <div className="matches--list">
            {this.getCollection().map(item =>
              this.getRenderObjectForItem(item))
            }
          </div>
        </Container>
      </div>
    );
  }
}

// type check to ensure we are called correctly
ListContainer.propTypes = {
  onListItemsChange: PropTypes.func.isRequired
};

// export so we are visible to parent
module.exports = ListContainer;
