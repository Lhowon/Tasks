sc_require('core');
sc_require('core_callbacks');

/**
 * An extension of the SC.DataSource class that acts as a proxy between the data store and the
 * remote server.
 *
 * @extends SC.DataSource
 * @author Sean Eidemiller
 */
CoreTasks.RemoteDataSource = SC.DataSource.extend({

  init: function() {
    sc_super();

    // Define the headers.
    var contentTypeHeader = 'Content-Type';
    var contentType = 'application/json';
    var acceptHeader = 'Accept';
    var accept = 'application/json, text/javascript, application/xml, text/xml, text/html, */*';

    // Initialize the request objects.
    this._getRequest = SC.Request.create({ type: 'GET', isJSON: YES })
      .header(contentTypeHeader, contentType).header(acceptHeader, accept);

    this._postRequest = SC.Request.create({ type: 'POST', isJSON: YES })
      .header(contentTypeHeader, contentType).header(acceptHeader, accept);

    this._putRequest = SC.Request.create({ type: 'PUT', isJSON: YES })
      .header(contentTypeHeader, contentType).header(acceptHeader, accept);

    this._delRequest = SC.Request.create({ type: 'DELETE', isJSON: YES })
      .header(contentTypeHeader, contentType).header(acceptHeader, accept);

    // Increase the max number of concurrent XHRs to 5 (default is 2).
    SC.Request.manager.set('maxRequests', 5);
  },

  /**
   * Fetches a list of records from the server and loads them into the given store.
   *
   * Valid paramaters (in the params hash):
   *  successCallback: Function to invoke on success.
   *  failureCallback: Function to invoke on failure.
   *  queryParams: Hash of query parameters to be appended to the URL.
   *
   * @param {SC.Store} store The store on behalf of which the fetch request is made.
   * @param {CoreTasks.Record | SC.Query} fetchKey
   * @param {Hash} params Additional parameters (optional).
   *
   * @returns {Array} An array of store keys.
   */
  fetch: function(store, fetchKey, params) {
    var ret = [];

    if (fetchKey) {
      // If we got an SC.Query, simply return it (SC.Store already did the work for us). I'm not
      // sure why it even bothers to call fetch(), but it does.
      if (SC.instanceOf(fetchKey, SC.Query)) {
        return fetchKey;
      }

      // Assume that the fetch key is a record type and get the plural resource path from the
      // corresponding record.
      var resourcePath = fetchKey.pluralResourcePath;

      if (!resourcePath) {
        console.log('Error fetching records: Unable to retrieve resource path from record type.');
        return ret;
      }

      // Build the request and send it off to the server.
      var path = CoreTasks.getFullResourcePath(
        resourcePath, null, params ? params.queryParams : null);
      this._getRequest.set('address', path);

      var requestParams = SC.merge({
          store: store,
          storeKeys: ret,
          recordType: fetchKey
        }, params ? params : {});

      this._getRequest.notify(this, this._fetchCompleted, requestParams).send();

    } else {
      console.log('Error fetching records: Fetch key is undefined or null.');
    }

    return ret;
  },

  _fetchCompleted: function(request, params) {
    var response = request.response();

    if (response.kindOf ? response.kindOf(SC.Error) : false) {
      console.log('Error fetching records from server.');

      // Invoke the failure callback (may not be defined).
      CoreTasks.invokeCallback(params.failureCallback);

    } else {
      // If there were no matching records, the server will return a 204 and the response object
      // will be an XMLHttpRequest instance.
      if (SC.instanceOf(response, XMLHttpRequest)) {
        // Verify that we got a 204.
        if (response.status === 204) {
          console.log('No matching results.');

          // Invoke the no-matching-records callback (may not be defined).
          CoreTasks.invokeCallback(params.noMatchingRecordsCallback);

        } else {
          // Assume failure.
          // TODO: [SE] What's the right thing to do here?
          console.log('Got unexpected response from server: %@ %@'.fmt(
            response.status, response.statusText));
          CoreTasks.invokeCallback(params.failureCallback);
        }

      } else {
        // The response object should be an array of JSON objects that need to be loaded into the
        // store.
        var storeKeys = params.store.loadRecords(params.recordType, response);
        params.storeKeys.replace(0, 0, storeKeys);

        // Invoke the success callback (may not be defined).
        CoreTasks.invokeCallback(params.successCallback);
      }
    }
  },

  /**
   * Retrieves a single record.
   *
   * @param {SC.Store} store The store on behalf of which the retrieval request is made.
   * @param {Array} storeKey The store key of the record.
   *
   * @returns {Boolean} YES if handled; otherwise NO.
   */
  retrieveRecord: function(store, storeKey) {
    var record = store.materializeRecord(storeKey);
    var recordType = store.recordTypeFor(storeKey);
    var id = store.idFor(storeKey);
    
    var idType = SC.typeOf(id);

    if (idType === SC.T_NUMBER || idType === SC.T_STRING){
      // Build the request and send it off to the server.
      var path = CoreTasks.getFullResourcePath(
        recordType.resourcePath, id, record.get('queryParams'));

      this._getRequest.set('address', path);
      this._getRequest.notify(this, this._retrieveCompleted, {
          store: store,
          storeKey: storeKey,
          recordType: recordType,
          id: id
        }
      ).send();

    } else {
      // The ID shouldn't be anything other than a string or number.
      console.log('Error retrieving record [%@]: Invalid ID type: %@'.fmt(recordType, idType));
    }

    return YES;
  },

  _retrieveCompleted: function(request, params) {
    var response = request.response();
    var callback;

    if (response.kindOf ? response.kindOf(SC.Error) : false) {
      console.log('Error retrieving record [%@:%@]'.fmt(params.recordType, params.id));

      // Set the failure callback.
      callback = CoreTasks.getCallback(
        'get', 'failure', params.recordType, response.get('request'));

    } else {
      // Load the record into the store.
      params.store.dataSourceDidComplete(params.storeKey, response, params.id);

      // Set the success callback.
      callback = CoreTasks.getCallback('get', 'success', params.recordType);
    }

    // Invoke the callback (may not be defined, but that's okay), passing along the record hash in
    // case it's needed.
    CoreTasks.invokeCallback(callback, response);
  },

  /**
   * Creates a single record.
   *
   * @param {SC.Store} store The store on behalf of which the creation request is made.
   * @param {Array} storeKey The store key of the new record.
   *
   * @returns {Boolean} YES if handled; otherwise NO.
   */
  createRecord: function(store, storeKey) {
    var dataHash = store.readDataHash(storeKey);
    var recordType = store.recordTypeFor(storeKey);
    var resourcePath = recordType.resourcePath;

    // Build the request and send it off to the server.
    this._postRequest.set('address', CoreTasks.getFullResourcePath(resourcePath));
    this._postRequest.notify(this, this._createCompleted, {
        store: store,
        storeKey: storeKey,
        recordType: recordType
      }
    ).send(dataHash);

    return YES;
  },

  _createCompleted: function(request, params) {
    var response = request.response();
    var callback;

    if (response.kindOf ? response.kindOf(SC.Error) : false) {
      console.log('Error creating record [%@]'.fmt(params.recordType));

      // Set the failure callback.
      callback = CoreTasks.getCallback(
        'post', 'failure', params.recordType, response.get('request'));

    } else {
      // Load the record into the store.
      params.store.dataSourceDidComplete(params.storeKey, response, params.id);

      // Set the success callback.
      callback = CoreTasks.getCallback('post', 'success', params.recordType);
    }

    // Invoke the callback (may not be defined, but that's okay), passing along the record hash in
    // case it's needed.
    CoreTasks.invokeCallback(callback, response);
  },

  /**
   * Updates a single record.
   *
   * @param {SC.Store} store The store on behalf of which the update request is made.
   * @param {Array} storeKey The store key of the record to update.
   *
   * @returns {Boolean} YES if handled; otherwise NO.
   */
  updateRecord: function(store, storeKey) {
    var dataHash = store.readDataHash(storeKey);
    var recordType = store.recordTypeFor(storeKey);
    var resourcePath = recordType.resourcePath;
    var id = store.idFor(storeKey);

    // Build the request and send it off to the server.
    this._putRequest.set('address', CoreTasks.getFullResourcePath(resourcePath, id));
    this._putRequest.notify(this, this._updateCompleted, {
        store: store,
        storeKey: storeKey,
        recordType: recordType,
        id: id
      }
    ).send(dataHash);

    return YES;
  },

  _updateCompleted: function(request, params) {
    var response = request.response();
    var callback;

    if (response.kindOf ? response.kindOf(SC.Error) : false) {
      console.log('Error updating record [%@:%@]'.fmt(params.recordType, params.id));

      // Set the failure callback.
      callback = CoreTasks.getCallback(
        'put', 'failure', params.recordType, response.get('request'));

    } else {
      // Load the record into the store.
      params.store.dataSourceDidComplete(params.storeKey, response, params.id);

      // Set the success callback.
      callback = CoreTasks.getCallback('put', 'success', params.recordType);
    }

    // Invoke the callback (may not be defined, but that's okay), passing along the record hash in
    // case it's needed.
    CoreTasks.invokeCallback(callback, response);
  },

  /**
   * Destroys (deletes) a single record.
   *
   * @param {SC.Store} store The store on behalf of which the destroy request is made.
   * @param {Array} storeKey The store key of the record to delete.
   *
   * @returns {Boolean} YES if handled; otherwise NO.
   */
  destroyRecord: function(store, storeKey) {
    var recordType = store.recordTypeFor(storeKey);
    var resourcePath = recordType.resourcePath;
    var id = store.idFor(storeKey);

    // Build the request and send it off to the server.
    this._delRequest.set('address', CoreTasks.getFullResourcePath(resourcePath, id));
    this._delRequest.notify(this, this._destroyCompleted, {
        store: store,
        storeKey: storeKey,
        recordType: recordType,
        id: id
      }
    ).send();

    return YES;
  },

  _destroyCompleted: function(request, params) {
    // There's a bug in SC.Request that causes a JS error if isJSON is set to true and the response
    // body is empty (and it will be if the deletion is successful).  Work around this by verifying
    // that the response body is *not* empty before calling response().
    var response = request.get('rawResponse');

    if (SC.typeOf(response) === SC.T_STRING) {
      if (response !== "") {
        // Safe to call response() function.
        response = request.response();
      }
    }
    
    var callback;

    if (response.kindOf ? response.kindOf(SC.Error) : false) {
      console.log('Error deleting record [%@:%@]'.fmt(params.recordType, params.id));

      // Get the callback.
      callback = CoreTasks.getCallback(
        'delete', 'failure', params.recordType, response.get('request'));
        
      // Get the JSON returned from the server, because it may be a deletion conflict.
      var json = null;
      var xhr = response.get('request');

      if (xhr && xhr.responseText) json = SC.json.decode(xhr.responseText);

      // Invoke the callback (with the JSON if present).
      if (json) {
        CoreTasks.invokeCallback(callback, json);
      } else {
        CoreTasks.invokeCallback(callback);
      }

    } else {
      // Remove the record from the store.
      params.store.dataSourceDidDestroy(params.storeKey);

      // Invoke the success callback.
      callback = CoreTasks.getCallback('delete', 'success', params.recordType);
      CoreTasks.invokeCallback(callback);
    }
  },

  cancel: function(store, storeKeys) {
    // TODO: [SE] Implement cancel functionality, if/when necessary.
    return NO;
  }

});

/**
 * An extension of the SC.FixturesDataSource class that provides functionality specific
 * to Tasks.
 *
 * We need support for queries, but the FixturesWithQueriesDataSource class is kinda broken (lots
 * of bugs). Therefore, we implement query support in this custom implementation of
 * FixturesDataSource instead.
 *
 * @extends SC.FixturesDataSource
 * @author Sean Eidemiller
 */
CoreTasks.FixturesDataSource = SC.FixturesDataSource.extend({

  fetch: function(store, fetchKey, params) {
    // If we got an SC.Query, simply return it (SC.Store already did the work for us). I'm not
    // sure why it even bothers to call fetch(), but it does.
    if (SC.instanceOf(fetchKey, SC.Query)) return fetchKey;

    var ret = sc_super();

    // Assume success.
    if (params) CoreTasks.invokeCallback(params.successCallback);

    return ret;
  },

  retrieveRecords: function(store, storeKeys) {
    return this._handleEach(store, storeKeys, this.retrieveRecord);  
  },

  retrieveRecord: function(store, storeKey) {
    var ret = [];

    // Notify the store that the data source completed.
    store.dataSourceDidComplete(storeKey, this.fixtureForStoreKey(store, storeKey),
      store.idFor(storeKey));

    ret.push(storeKey);

    // Assume success.
    var recType = store.recordTypeFor(storeKey);
    var callback = CoreTasks.getCallback('get', 'success', recType, { status: 200 });
    CoreTasks.invokeCallback(callback, store.readDataHash(storeKey));

    return ret;
  },

  createRecord: function(store, storeKey) {
    // Notify the store that the data source completed.
    var recordHash = store.readDataHash(storeKey);
    store.dataSourceDidComplete(storeKey, recordHash, store.idFor(storeKey));

    // Assume success.
    var recType = store.recordTypeFor(storeKey);
    var callback = CoreTasks.getCallback('post', 'success', recType, { status: 201 });
    CoreTasks.invokeCallback(callback, recordHash);
  },

  updateRecord: function(store, storeKey) {
    // Notify the store that the data source completed.
    store.dataSourceDidComplete(storeKey);

    // Assume success.
    var recType = store.recordTypeFor(storeKey);
    var callback = CoreTasks.getCallback('put', 'success', recType, { status: 200 });
    CoreTasks.invokeCallback(callback, store.readDataHash(storeKey));
  },

  destroyRecord: function(store, storeKey) {
    sc_super();

    // Assume success.
    var recType = store.recordTypeFor(storeKey);
    var callback = CoreTasks.getCallback('delete', 'success', recType, { status: 204 });
    CoreTasks.invokeCallback(callback);
  }

});

// Register one of the data sources with the store, depending on operating mode.
if (CoreTasks.get('mode') === CoreTasks.get('ONLINE_MODE')) {
  // Use the remote data source.
  CoreTasks.get('store').from(CoreTasks.RemoteDataSource.create());
  console.log('Initialized remote data source.');
} else {
  // Use the fixtures data source.
  CoreTasks.get('store').from(CoreTasks.FixturesDataSource.create());
  console.log('Initialized fixtures data source.');
}