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

import PropTypes from 'prop-types';
import ListContainer from '../ListBase/ListContainer';

/**
 * CategoriesFilter - A container component for Category objects.
 * This object appears on the web page and allows the user to
 * filter matches based on a 'category' value. It's core functionality
 * comes from its parents class - the FilterContainer.
 */
class CategoriesList extends ListContainer {
  constructor(...props) {
    super(...props);

    this.state = {
      categories: this.props.categories,
    };
  }

  /**
   * getCollection - Override parent class to return collection 
   * of all category items.
   */
  getCollection() {
    const { categories } = this.state;
    return categories;
  }

  /**
   * getContainerTitle - Override parent class to return title of 
   * the filter container. 
   */
  getContainerTitle() {
    return 'Top Categories';
  } 
  
  // Important - this is needed to ensure changes to main properties
  // are propagated down to our component. In this case, some other
  // search or filter event has occured which has changed the list of 
  // cateories, or which categories are selected.
  componentWillReceiveProps(nextProps) {
    this.setState({ categories: nextProps.categories });
  }
}

// type check to ensure we are called correctly
CategoriesList.propTypes = {
  categories: PropTypes.array
};

// export so we are visible to parent
module.exports = CategoriesList;
