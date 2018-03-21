/* eslint-disable camelcase */
import request from 'browser-request';
import OAuth from 'oauth-1.0a';
import crypto from 'crypto-browserify';
import promise from 'bluebird';
import _url from 'url';

/**
 * WooCommerce REST API wrappercat
 *
 * @param {Object} opt
 */
class WooCommerceAPI {

  constructor(opt) {

    opt = opt || {};

    if (!(opt.url)) {
      throw new Error('url is required');
    }

    if (!(opt.consumerKey)) {
      throw new Error('consumerKey is required');
    }

    if (!(opt.consumerSecret)) {
      throw new Error('consumerSecret is required');
    }

    this.classVersion = '1.4.2';
    this._setDefaultsOptions(opt);
  }

  /**
   * Set default options
   *
   * @param {Object} opt
   */
  _setDefaultsOptions(opt) {
    this.url = opt.url;
    this.wpAPI = opt.wpAPI || false;
    this.wpAPIPrefix = opt.wpAPIPrefix || 'wp-json';
    this.version = opt.version || 'v3';
    this.isSsl = /^https/i.test(this.url);
    this.consumerKey = opt.consumerKey;
    this.consumerSecret = opt.consumerSecret;
    this.verifySsl = opt.verifySsl !== false;
    this.encoding = opt.encoding || 'utf8';
    this.queryStringAuth = opt.queryStringAuth || false;
    this.port = opt.port || '';
    this.timeout = opt.timeout;
  };

  /**
   * Normalize query string for oAuth
   *
   * @param  {string} url
   * @return {string}
   */
  _normalizeQueryString(url) {
    // Exit if don't find query string
    if (url.indexOf('?') === -1) {
      return url;
    }

    const query = _url.parse(url, true).query;
    const params = [];
    let queryString = '';

    for (let p in query) {
      params.push(p);
    }
    params.sort();

    for (let i in params) {
      if (queryString.length) {
        queryString += '&';
      }

      queryString += encodeURIComponent(params[i]).replace('%5B', '[')
        .replace('%5D', ']');
      queryString += '=';
      queryString += encodeURIComponent(query[params[i]]);
    }

    return url.split('?')[0] + '?' + queryString;
  };

  /**
   * Get URL
   *
   * @param  {String} endpoint
   *
   * @return {String}
   */
  _getUrl(endpoint) {
    var url = this.url.slice(-1) === '/' ? this.url : this.url + '/';
    var api = this.wpAPI ? this.wpAPIPrefix + '/' : 'wc-api/';

    url = url + api + this.version + '/' + endpoint;

    // Include port.
    if (this.port !== '') {
      let hostname = _url.parse(url, true).hostname;

      url = url.replace(hostname, hostname + ':' + this.port);
    }

    if (!this.isSsl) {
      return this._normalizeQueryString(url);
    }

    return url;
  };

  /**
   * Get OAuth
   *
   * @return {Object}
   */
  _getOAuth() {
    var data = {
      consumer: {
        key: this.consumerKey,
        secret: this.consumerSecret
      },
      signature_method: 'HMAC-SHA256',
      hash_function: function (base_string, key) {
        return crypto.createHmac('sha256', key).update(base_string)
          .digest('base64');
      }
    };

    if ([ 'v1', 'v2' ].indexOf(this.version) > -1) {
      data.last_ampersand = false;
    }

    return new OAuth(data);
  };

  /**
   * Do requests
   *
   * @param  {String}   method
   * @param  {String}   endpoint
   * @param  {Object}   data
   * @param  {Function} callback
   *
   * @return {Object}
   */
  _request(method, endpoint, data, callback) {
    var url = this._getUrl(endpoint);

    var params = {
      url: url,
      method: method,
      encoding: this.encoding,
      timeout: this.timeout,
      headers: {
        'User-Agent': 'WooCommerce API Client-Node.js/' + this.classVersion,
        'Accept': 'application/json'
      }
    };

    if (this.isSsl) {
      if (this.queryStringAuth) {
        params.qs = {
          consumer_key: this.consumerKey,
          consumer_secret: this.consumerSecret
        };
      } else {
        params.auth = {
          user: this.consumerKey,
          pass: this.consumerSecret
        };
      }

      if (!this.verifySsl) {
        params.strictSSL = false;
      }
    } else {
      params.qs = this._getOAuth().authorize({
        url: url,
        method: method
      });
    }

    if (data) {
      params.headers['Content-Type'] = 'application/json;charset=utf-8';
      params.body = JSON.stringify(data);
    }

    if (!callback) {
      return request(params);
    }

    return request(params, callback);
  };

  /**
   * GET requests
   *
   * @param  {String}   endpoint
   * @param  {Function} callback
   *
   * @return {Object}
   */
  _get(endpoint, callback) {
    return this._request('GET', endpoint, null, callback);
  };

  get = promise.promisify(this._get);

  /**
   * POST requests
   *
   * @param  {String}   endpoint
   * @param  {Object}   data
   * @param  {Function} callback
   *
   * @return {Object}
   */
  _post(endpoint, data, callback) {
    return this._request('POST', endpoint, data, callback);
  };

  post = promise.promisify(this._post);

  /**
   * PUT requests
   *
   * @param  {String}   endpoint
   * @param  {Object}   data
   * @param  {Function} callback
   *
   * @return {Object}
   */
  _put(endpoint, data, callback) {
    return this._request('PUT', endpoint, data, callback);
  };

  put = promise.promisify(this._put);

  /**
   * DELETE requests
   *
   * @param  {String}   endpoint
   * @param  {Function} callback
   *
   * @return {Object}
   */
  _delete(endpoint, callback) {
    return this._request('DELETE', endpoint, null, callback);
  };

  delete = promise.promisify(this._delete);

  /**
   * OPTIONS requests
   *
   * @param  {String}   endpoint
   * @param  {Function} callback
   *
   * @return {Object}
   */
  _options(endpoint, callback) {
    return this._request('OPTIONS', endpoint, null, callback);
  };

  options = promise.promisify(this._options);
}

/**
 * Promifying all requests exposing new methods
 * named [method]Async like in getAsync()
 */
// promise.promisifyAll(WooCommerceAPI);

export default WooCommerceAPI;
