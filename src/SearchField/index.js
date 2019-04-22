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
import { Header, Grid, Input } from 'semantic-ui-react';

/**
 * This object renders a search field at the top of the web page,
 * along with optional search parameter check boxes.
 * This object must determine when the user has entered a new
 * search value or toggled any of the check boxes and then propogate 
 * the event to the parent.
 */
export default class SearchField extends React.Component {
  constructor(...props) {
    super(...props);
    this.state = {
      searchQuery: this.props.searchQuery || ''
    };
  }

  /**
   * handleKeyPress - user has entered a new search value. 
   * Pass on to the parent object.
   */
  handleKeyPress(event) {
    const searchValue = event.target.value;
    if (event.key === 'Enter') {
      this.props.onSearchQueryChange({
        searchQuery: searchValue
      });
    }
  }

  /**
   * render - return the input field to render.
   */
  render() {
    return (
      <Grid className='search-field-grid'>
        <Grid.Column verticalAlign='middle' textAlign='center'>
          <Header as='h1' textAlign='center'>
            SDU Document Search
          </Header>
          <Input
            className='searchinput'
            icon='search'
            placeholder='Enter search string...'
            onKeyPress={this.handleKeyPress.bind(this)}
            defaultValue={this.state.searchQuery}
          />
        </Grid.Column>
      </Grid>
    );
  }
}

// type check to ensure we are called correctly
SearchField.propTypes = {
  onSearchQueryChange: PropTypes.func.isRequired,
  searchQuery: PropTypes.string
};
