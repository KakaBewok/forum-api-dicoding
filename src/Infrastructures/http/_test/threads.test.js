const createServer = require('../createServer');
const container = require('../../container');
const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');

describe('/threads endpoint', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('when POST /threads', () => {
    let token = '';

    beforeAll(async () => {
      // Arrange
      const server = await createServer(container);
      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding2',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });
      // login user
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding2',
          password: 'secret',
        },
      });
      const {
        data: { accessToken },
      } = JSON.parse(loginResponse.payload);

      token = accessToken;
    });

    it('should response 201 and persisted thread', async () => {
      // Arrange
      const server = await createServer(container);
      // add thread
      const requestPayload = {
        title: 'This is title for thread',
        body: 'This is content for your thread',
      };
      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
    });

    it('should response 400 if thread payload not contain needed property', async () => {
      // Arrange
      const server = await createServer(container);
      // add thread
      const requestPayload = {
        title: 'This is title for thread',
      };
      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada'
      );
    });

    it('should response 400 if thread payload wrong data type', async () => {
      // Arrange
      const server = await createServer(container);
      // add thread
      const requestPayload = {
        title: 'This is title for thread',
        body: true,
      };
      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat thread baru karena tipe data tidak sesuai'
      );
    });

    it('should response 400 when title more than 50 character', async () => {
      // Arrange
      const server = await createServer(container);
      // add thread
      const requestPayload = {
        title:
          'This is title for thread This is title for thread This is title for thread This is title for thread This is title for thread This is title for thread This is title for thread',
        body: 'This is content',
      };
      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat thread baru karena karakter judul melebihi batas limit'
      );
    });

    it('should response 401 if thread headers not contain authorization', async () => {
      // Arrange
      const server = await createServer(container);
      // add thread
      const requestPayload = {
        title: 'This is title for thread',
        body: 'this is content',
      };
      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
      });
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Missing authentication');
    });
  });

  describe('when GET /threads/{threadId}', () => {
    let threadId = '';

    beforeAll(async () => {
      // Arrange
      const server = await createServer(container);
      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding2',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });
      // login user
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding2',
          password: 'secret',
        },
      });
      const {
        data: { accessToken },
      } = JSON.parse(loginResponse.payload);
      // add thread
      const requestPayload = {
        title: 'This is title for thread',
        body: 'This is content for your thread',
      };
      // Action
      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const {
        data: {
          addedThread: { id },
        },
      } = JSON.parse(threadResponse.payload);
      threadId = id;
    });

    it('should response 200 and persisted detail thread', async () => {
      // Arrange
      const server = await createServer(container);
      // Action
      // get detail thread
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();
    });

    it('should response 404 if detail thread id not contain', async () => {
      // Arrange
      const server = await createServer(container);
      // Action
      // get detail thread
      const response = await server.inject({
        method: 'GET',
        url: `/threads`,
      });
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(responseJson.statusCode).toEqual(404);
      expect(responseJson.message).toEqual('Not Found');
    });

    it('should response 404 if detail thread id wrong data type', async () => {
      // Arrange
      const server = await createServer(container);
      // Action
      // get detail thread
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${false}`,
      });
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });
  });
});
