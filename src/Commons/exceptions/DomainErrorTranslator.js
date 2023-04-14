const InvariantError = require('./InvariantError');
const AuthenticationError = require('./AuthenticationError');
const AuthorizationError = require('./AuthorizationError');
const NotFoundError = require('./NotFoundError');

const DomainErrorTranslator = {
  translate(error) {
    return DomainErrorTranslator._directories[error.message] || error;
  },
};

DomainErrorTranslator._directories = {
  // register
  'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'
  ),
  'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'tidak dapat membuat user baru karena tipe data tidak sesuai'
  ),
  'REGISTER_USER.USERNAME_LIMIT_CHAR': new InvariantError(
    'tidak dapat membuat user baru karena karakter username melebihi batas limit'
  ),
  'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': new InvariantError(
    'tidak dapat membuat user baru karena username mengandung karakter terlarang'
  ),
  // registered
  'REGISTERED_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'
  ),
  'REGISTERED_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'tidak dapat membuat user baru karena tipe data tidak sesuai'
  ),
  // login
  'USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'harus mengirimkan username dan password'
  ),
  'USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'username dan password harus string'
  ),
  // new auth
  'NEW_AUTH.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'harus mengirimkan token'
  ),
  'NEW_AUTH.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'token harus string'
  ),
  // add thread
  'ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada'
  ),
  'ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'tidak dapat membuat thread baru karena tipe data tidak sesuai'
  ),
  'ADD_THREAD.TITLE_LIMIT_CHAR': new InvariantError(
    'tidak dapat membuat thread baru karena karakter judul melebihi batas limit'
  ),
  'ADD_THREAD.NO_AUTHORIZATION': new AuthenticationError(
    'Missing authentication'
  ),
  // get detail thread
  'DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY': new NotFoundError(
    'tidak dapat mengambil thread karena properti yang dibutuhkan tidak ada'
  ),
  'DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'tidak dapat mengambil thread karena tipe data tidak sesuai'
  ),
  // add comment
  'ADD_COMMENT.NO_AUTHORIZATION': new AuthenticationError(
    'Missing authentication'
  ),
  'ADD_COMMENT.NO_PARAMS': new NotFoundError('params tidak ditemukan'),
  'ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada'
  ),
  'ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'tidak dapat membuat comment baru karena tipe data tidak sesuai'
  ),
  'ADD_COMMENT.CONTENT_LIMIT_CHAR': new InvariantError(
    'tidak dapat membuat komentar baru karena karakter judul melebihi batas limit'
  ),
  // delete comment
  'DELETE_COMMENT.NO_AUTHORIZATION': new AuthenticationError(
    'Missing authentication'
  ),
  'DELETE_COMMENT.NO_PARAMS': new NotFoundError('parameter komen id tidak ada'),
  'DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'tidak dapat menghapus comment karena data yang dibutuhkan tidak ada'
  ),
  'DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'tidak dapat menghapus comment karena tipe data yang dibutuhkan tidak sesuai'
  ),
  // refresh token
  'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN':
    new InvariantError('harus mengirimkan token refresh'),
  'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION':
    new InvariantError('refresh token harus string'),
  // logout
  'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN':
    new InvariantError('harus mengirimkan token refresh'),
  'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION':
    new InvariantError('refresh token harus string'),
};

module.exports = DomainErrorTranslator;

// 'ADD_COMMENT.NOT_FOUND_THREAD': new InvariantError('Thread tidak ditemukan'),
