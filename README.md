# WooCommerce API - Javascipt / React Native Client

A Javascript / React Native wrapper for the WooCommerce REST API. Easily interact with the WooCommerce REST API using this library.
Based on <https://github.com/woocommerce/wc-api-node>

## Installation

```
npm install --save https://github.com/sabarnix/woocommerce-api.git
or
yarn add https://github.com/sabarnix/woocommerce-api.git
```

## Getting started

Generate API credentials (Consumer Key & Consumer Secret) following this instructions <http://docs.woocommerce.com/document/woocommerce-rest-api/>
.

Check out the WooCommerce API endpoints and data that can be manipulated in <http://woocommerce.github.io/woocommerce-rest-api-docs/>.

## Setup

Setup for the new WP REST API integration (WooCommerce 2.6 or later):

```js
import WooCommerceAPI from 'woocommerce-api';

const WooCommerce = new WooCommerceAPI({
  url: 'http://example.com',
  consumerKey: 'ck_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  consumerSecret: 'cs_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  wpAPI: true,
  version: 'wc/v1'
});
```

Setup for the old WooCommerce legacy API:

```js
import WooCommerceAPI from 'woocommerce-api';

const WooCommerce = new WooCommerceAPI({
  url: 'http://example.com',
  consumerKey: 'ck_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  consumerSecret: 'cs_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  version: 'v3'
});
```

### Options

|       Option      |    Type   | Required |                                               Description                                                |
|-------------------|-----------|----------|----------------------------------------------------------------------------------------------------------|
| `url`             | `String`  | yes      | Your Store URL, example: http://woo.dev/                                                                 |
| `consumerKey`     | `String`  | yes      | Your API consumer key                                                                                    |
| `consumerSecret`  | `String`  | yes      | Your API consumer secret                                                                                 |
| `wpAPI`           | `Bool`    | no       | Allow requests to the WP REST API (WooCommerce 2.6 or later)                                             |
| `wpAPIPrefix`     | `String`  | no       | Custom WP REST API URL prefix, used to support custom prefixes created with the `rest_url_prefix` filter |
| `version`         | `String`  | no       | API version, default is `v3`                                                                             |
| `verifySsl`       | `Bool`    | no       | Verify SSL when connect, use this option as `false` when need to test with self-signed certificates      |
| `encoding`        | `String`  | no       | Encoding, default is 'utf-8'                                                                             |
| `queryStringAuth` | `Bool`    | no       | When `true` and using under HTTPS force Basic Authentication as query string, default is `false`         |
| `port`            | `string`  | no       | Provive support for URLs with ports, eg: `8080`                                                          |
| `timeout`         | `Integer` | no       | Define the request timeout                                                                               |

## Methods

|   Params   |    Type    |                         Description                          |
|------------|------------|--------------------------------------------------------------|
| `endpoint` | `String`   | WooCommerce API endpoint, example: `customers` or `order/12` |
| `data`     | `Object`   | JS object, will be converted to JSON                         |
| `callback` | `Function` | Callback function. Returns `err`, `data` and `res`           |

### GET

- `.get(endpoint)`
- `.get(endpoint, callback)`

### POST

- `.post(endpoint, data)`
- `.post(endpoint, data, callback)`

### PUT

- `.put(endpoint, data)`
- `.put(endpoint, data, callback)`

### DELETE

- `.delete(endpoint)`
- `.delete(endpoint, callback)`

### OPTIONS

- `.options(endpoint)`
- `.options(endpoint, callback)`

## Promified Methods

Every method can be used in a promified way just adding `Async` to the method name. Like in:

```js
WooCommerce.getAsync('products').then(function(result) {
  return JSON.parse(result.toJSON().body);
});
```
