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

'use strict';

require('dotenv').config({
  silent: true
});

require('isomorphic-fetch');
const Promise = require('bluebird');
const queryString = require('query-string');
const queryBuilder = require('./query-builder');
const discovery = require('./watson-discovery-service');
const utils = require('../lib/utils');

/**
 * Back end server which handles initializing the Watson Discovery
 * service, and setting up route methods to handle client requests.
 */

const WatsonDiscoveryService = new Promise((resolve, reject) => {
  // listEnvironments as sanity check to ensure creds are valid
  discovery.listEnvironments({})
    .then(() => {
      // environment and collection ids are always the same for Watson News
      const environmentId = discovery.environmentId;
      const collectionId = discovery.collectionId;
      queryBuilder.setEnvironmentId(environmentId);
      queryBuilder.setCollectionId(collectionId);
      resolve(createServer());
    })
    .catch(error => {
      // eslint-disable-next-line no-console
      console.error(error);
      reject(error);
    });
});

/**
 * createServer - create express server and handle requests
 * from client.
 */
function createServer() {
  const server = require('./express');

  // handles search request from search bar
  server.get('/api/search', (req, res) => {
    const { query, count } = req.query;
    var params = {};

    console.log('In /api/search: query = ' + query);

    // add query
    params.natural_language_query = query;
    
    params.count = count;
    params.passages_count = count;
    params.passages = true;
    
    var searchParams = queryBuilder.search(params);
    discovery.query(searchParams)
      .then(response => res.json(response))
      .catch(error => {
        if (error.message === 'Number of free queries per month exceeded') {
          res.status(429).json(error);
        } else {
          res.status(error.code).json(error);
        }
      });
  });

  // handles search string appened to url
  server.get('/:searchQuery', function(req, res){
    var searchQuery = req.params.searchQuery.replace(/\+/g, ' ');
    const qs = queryString.stringify({ 
      query: searchQuery,
      count: 6,
      returnPassages: true,
      queryType: 'natural_language_query'
    });
    const fullUrl = req.protocol + '://' + req.get('host');

    console.log('In /:searchQuery: query = ' + qs);

    fetch(fullUrl + `/api/search?${qs}`)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw response;
        }
      })
      .then(results => {

        // get all the results data in right format
        var passages = utils.formatData(results.passages);
        // const util = require('util');
        console.log('++++++++++++ DISCO RESULTS ++++++++++++++++++++');
        // console.log(util.inspect(passages, false, null));
        console.log('length: ' + passages.length);

        res.render('index',
          {
            data: passages,
            entities: results,
            categories: results,
            concepts: results,
            keywords: results,
            entityTypes: results,
            searchQuery,
            numMatches: passages.length,
            error: null
          }
        );
      })
      .catch(response => {
        res.status(response.status).render('index', {
          error: (response.status === 429) ? 'Number of free queries per month exceeded' : 'Error fetching data'
        });
      });
  });

  // initial start-up request
  server.get('/*', function(req, res) {
    console.log('In /*');

    // this is the inital query to the discovery service
    console.log('Initial Search Query at start-up');
    const params = queryBuilder.search({ 
      natural_language_query: '',
      count: 6,
      highlight: false,
      passages: true
    });
    return new Promise((resolve, reject) => {
      discovery.query(params)
        .then(results =>  {

          // const util = require('util');
          // console.log('++++++++++++ DISCO RESULTS ++++++++++++++++++++');
          // console.log(util.inspect(results, false, null));
      
          // get all the results data in right format
          var passages = utils.formatData(results.passages);

          res.render('index', { 
            data: passages,
            entities: results,
            categories: results,
            concepts: results,
            keywords: results,
            entityTypes: results,
            numMatches: passages.length
          });
    
          resolve(passages);
        })
        .catch(error => {
          console.error(error);
          reject(error);
        });
    });
    
  });

  return server;
}

module.exports = WatsonDiscoveryService;
