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

import 'isomorphic-fetch';
import React from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import Matches from './Matches';
import SearchField from './SearchField';
import EntitiesList from './EntitiesList';
import CategoriesList from './CategoriesList';
import ConceptsList from './ConceptsList';
import KeywordsList from './KeywordsList';
import EntityTypesList from './EntityTypesList';
import { Grid, Dimmer, Header, Loader, Accordion, Icon } from 'semantic-ui-react';
const utils = require('../lib/utils');

/**
 * Main React object that contains all objects on the web page.
 * This object manages all interaction between child objects as
 * well as making search requests to the discovery service.
 */
class Main extends React.Component {
  constructor(...props) {
    super(...props);
    const { 
      // query data
      data,
      entities,
      categories,
      concepts,
      keywords,
      entityTypes,
      numMatches,
      error,
      // query params
      searchQuery
    } = this.props;

    // change in state fires re-render of components
    this.state = {
      // query data
      data: data,   // data should already be formatted
      entities: entities && parseEntities(entities),
      categories: categories && parseCategories(categories),
      concepts: concepts && parseConcepts(concepts),
      keywords: keywords && parseKeywords(keywords),
      entityTypes: entityTypes && parseEntityTypes(entityTypes),
      numMatches: numMatches || 0,
      loading: false,
      error: error,
      // query params
      searchQuery: searchQuery || '',
      activeFilterIndex: 0,             // which filter index is expanded/active
    };
  }

  /**
   * searchQueryChanged - (callback function)
   * User has entered a new search string to query on. 
   * This results in making a new qeury to the disco service.
   */
  searchQueryChanged(query) {
    const { searchQuery } = query;
    console.log('searchQuery [FROM SEARCH]: ' + searchQuery);
   
    // true = clear all filters for new search
    this.fetchData(searchQuery, true);
  }

  /**
   * fetchData - build the query that will be passed to the 
   * discovery service.
   */
  fetchData(query) {
    const searchQuery = query;

    // console.log("QUERY2 - selectedCategories: ");
    // for (let item of selectedCategories)
    //   console.log(util.inspect(item, false, null));
    // console.log("QUERY2 - searchQuery: " + searchQuery);
    
    this.setState({
      loading: true,
      searchQuery
    });

    scrollToMain();
    history.pushState({}, {}, `/${searchQuery.replace(/ /g, '+')}`);

    // build query string, with filters and optional params
    const qs = queryString.stringify({
      query: searchQuery,
      count: 6
    });

    // send request
    fetch(`/api/search?${qs}`)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw response;
        }
      })
      .then(json => {
        var passages = parsePassages(json);
        passages = utils.formatData(passages.results);
        
        console.log('+++ DISCO RESULTS +++');
        // const util = require('util');
        // console.log(util.inspect(data.results, false, null));
        console.log('numMatches: ' + passages.length);
      
        this.setState({
          data: passages,
          entities: parseEntities(json),
          categories: parseCategories(json),
          concepts: parseConcepts(json),
          keywords: parseKeywords(json),
          entityTypes: parseEntityTypes(json),
          loading: false,
          numMatches: passages.length,
          error: null
        });
        scrollToMain();
      })
      .catch(response => {
        this.setState({
          error: (response.status === 429) ? 'Number of free queries per month exceeded' : 'Error fetching results',
          loading: false,
          data: null
        });
        // eslint-disable-next-line no-console
        console.error(response);
      });
  }
  
  /**
   * getMatches - return collection matches to be rendered.
   */
  getMatches() {
    const { data } = this.state;

    if (!data || data.results.length == 0) {
      return (
        <Header as='h3' textAlign='center'>
            No results found. Please enter new search query.
        </Header>
      );
    } else {
      return (
        <Matches 
          matches={ data.results }
        />
      );
    }
  }

  /**
   * handleAccordionClick - (callback function)
   * User has selected one of the
   * filter boxes to expand and show values for.
   */
  handleAccordionClick(e, titleProps) {
    const { index } = titleProps;
    const { activeFilterIndex } = this.state;
    const newIndex = activeFilterIndex === index ? -1 : index;
    this.setState({ activeFilterIndex: newIndex });
  }

  /**
   * getEntities - return entities to be rendered.
   */
  getEntitiesList() {
    const { entities } = this.state;
    if (!entities) {
      return null;
    }
    return (
      <EntitiesList
        entities={entities.results}
      />
    );
  }

  /**
   * getCategoriesList - return categories to be rendered.
   */
  getCategoriesList() {
    const { categories } = this.state;
    if (!categories) {
      return null;
    }
    return (
      <CategoriesList
        categories={categories.results}
      />
    );
  }

  /**
   * getConceptsList - return concepts to be rendered.
   */
  getConceptsList() {
    const { concepts } = this.state;
    if (!concepts) {
      return null;
    }
    return (
      <ConceptsList
        concepts={concepts.results}
      />
    );
  }

  /**
   * getKeywordsList - return keywords to be rendered.
   */
  getKeywordsList() {
    const { keywords } = this.state;
    if (!keywords) {
      return null;
    }
    return (
      <KeywordsList
        keywords={keywords.results}
      />
    );
  }

  /**
   * getEntityTypeFilter - return entity types to be rendered.
   */
  getEntityTypesList() {
    const { entityTypes } = this.state;
    if (!entityTypes) {
      return null;
    }
    return (
      <EntityTypesList
        entityTypes={entityTypes.results}
      />
    );
  }

  /**
   * render - return all the home page object to be rendered.
   */
  render() {
    const { loading, data, error, searchQuery, activeFilterIndex } = this.state;

    return (
      <Grid celled className='search-grid'>

        {/* Search Field Header */}

        <Grid.Row>
          <Grid.Column width={16} textAlign='center'>
            <SearchField
              onSearchQueryChange={this.searchQueryChanged.bind(this)}
              searchQuery={searchQuery}
            />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row className='matches-grid-row'>

          <Grid.Column width={4}>
            <Header as='h2' block textAlign='left'>
              <Header.Content>
                Enrichments
              </Header.Content>
            </Header>
            <Accordion styled>
              <Accordion.Title
                active={activeFilterIndex == utils.ENTITY_DATA_INDEX}
                index={utils.ENTITY_DATA_INDEX}
                onClick={this.handleAccordionClick.bind(this)}>
                <Icon name='dropdown' />
                Entities
              </Accordion.Title>
              <Accordion.Content active={activeFilterIndex == utils.ENTITY_DATA_INDEX}>
                {this.getEntitiesList()}
              </Accordion.Content>
            </Accordion>
            <Accordion styled>
              <Accordion.Title
                active={activeFilterIndex == utils.CATEGORY_DATA_INDEX}
                index={utils.CATEGORY_DATA_INDEX}
                onClick={this.handleAccordionClick.bind(this)}>
                <Icon name='dropdown' />
                Categories
              </Accordion.Title>
              <Accordion.Content active={activeFilterIndex == utils.CATEGORY_DATA_INDEX}>
                {this.getCategoriesList()}
              </Accordion.Content>
            </Accordion>
            <Accordion styled>
              <Accordion.Title
                active={activeFilterIndex == utils.CONCEPT_DATA_INDEX}
                index={utils.CONCEPT_DATA_INDEX}
                onClick={this.handleAccordionClick.bind(this)}>
                <Icon name='dropdown' />
                Concepts
              </Accordion.Title>
              <Accordion.Content active={activeFilterIndex == utils.CONCEPT_DATA_INDEX}>
                {this.getConceptsList()}
              </Accordion.Content>
            </Accordion>
            <Accordion styled>
              <Accordion.Title
                active={activeFilterIndex == utils.KEYWORD_DATA_INDEX}
                index={utils.KEYWORD_DATA_INDEX}
                onClick={this.handleAccordionClick.bind(this)}>
                <Icon name='dropdown' />
                Keywords
              </Accordion.Title>
              <Accordion.Content active={activeFilterIndex == utils.KEYWORD_DATA_INDEX}>
                {this.getKeywordsList()}
              </Accordion.Content>
            </Accordion>
            <Accordion styled>
              <Accordion.Title
                active={activeFilterIndex == utils.ENTITY_TYPE_DATA_INDEX}
                index={utils.ENTITY_TYPE_DATA_INDEX}
                onClick={this.handleAccordionClick.bind(this)}>
                <Icon name='dropdown' />
                Entity Types
              </Accordion.Title>
              <Accordion.Content active={activeFilterIndex == utils.ENTITY_TYPE_DATA_INDEX}>
                {this.getEntityTypesList()}
              </Accordion.Content>
            </Accordion>
          </Grid.Column>

          {/* Results */}

          <Grid.Column width={12}>
            <Grid.Row>
              {loading ? (
                <div className="results">
                  <div className="loader--container">
                    <Dimmer active inverted>
                      <Loader>Loading</Loader>
                    </Dimmer>
                  </div>
                </div>
              ) : data ? (
                <div className="results">
                  <div className="_container _container_large">
                    <div className="row">
                      {this.getMatches()}
                    </div>
                  </div>
                </div>
              ) : error ? (
                <div className="results">
                  <div className="_container _container_large">
                    <div className="row">
                      {JSON.stringify(error)}
                    </div>
                  </div>
                </div>
              ) : null}
            </Grid.Row>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

const parsePassages = data => ({
  rawResponse: Object.assign({}, data),
  // sentiment: data.aggregations[0].results.reduce((accumulator, result) =>
  //   Object.assign(accumulator, { [result.key]: result.matching_results }), {}),
  results: data.passages
});

/**
 * parseEntities - convert raw search results into collection of entities.
 */
const parseEntities = data => ({
  rawResponse: Object.assign({}, data),
  results: data.aggregations[utils.ENTITY_DATA_INDEX].results
});

/**
 * parseCategories - convert raw search results into collection of categories.
 */
const parseCategories = data => ({
  rawResponse: Object.assign({}, data),
  results: data.aggregations[utils.CATEGORY_DATA_INDEX].results
});

/**
 * parseConcepts - convert raw search results into collection of concepts.
 */
const parseConcepts = data => ({
  rawResponse: Object.assign({}, data),
  results: data.aggregations[utils.CONCEPT_DATA_INDEX].results
});

/**
 * parseKeywords - convert raw search results into collection of keywords.
 */
const parseKeywords = data => ({
  rawResponse: Object.assign({}, data),
  results: data.aggregations[utils.KEYWORD_DATA_INDEX].results
});

/**
 * parseEntityTypes - convert raw search results into collection of entity types.
 */
const parseEntityTypes = data => ({
  rawResponse: Object.assign({}, data),
  results: data.aggregations[utils.ENTITY_TYPE_DATA_INDEX].results
});

/**
 * scrollToMain - scroll window to show 'main' rendered object.
 */
function scrollToMain() {
  setTimeout(() => {
    const scrollY = document.querySelector('main').getBoundingClientRect().top + window.scrollY;
    window.scrollTo(0, scrollY);
  }, 0);
}

// type check to ensure we are called correctly
Main.propTypes = {
  data: PropTypes.object,
  entities: PropTypes.object,
  categories: PropTypes.object,
  concepts: PropTypes.object,
  keywords: PropTypes.object,
  entityTypes: PropTypes.object,
  searchQuery: PropTypes.string,
  numMatches: PropTypes.number,
  error: PropTypes.object
};

module.exports = Main;
