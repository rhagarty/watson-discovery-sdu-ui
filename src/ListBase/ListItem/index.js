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
import { Label } from 'semantic-ui-react';

/**
 * ListItem - A checkbox component used as a base item
 * for all list types returned by the disco query.
 */
class ListItem extends React.Component {
  constructor(...props) {
    super(...props);
  }

  /**
   * render - Render component in UI.
   */
  render() {
    const { label } = this.props;

    return (
      <div>
        <Label as='a' basic> 
          {label}
        </Label>
      </div>
    );
  }
}

// type check to ensure we are called correctly
ListItem.propTypes = {
  label: PropTypes.string.isRequired
};

// export so we are visible
module.exports = ListItem;
