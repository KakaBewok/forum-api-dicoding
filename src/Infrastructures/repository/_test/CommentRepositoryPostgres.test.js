const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('Available thread and comment function', () => {
    it('should not throw NotFoundError when comment available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
      });
      await ThreadsTableTestHelper.addThread({
        owner: 'user-123',
      });

      const addComment = new AddComment({
        threadId: 'thread-123',
        content: 'test',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123'; // stub!

      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await commentRepositoryPostgres.addCommentInThread(addComment);

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyCommentAvailability(
          'thread-123',
          'comment-123',
          'user-123'
        )
      ).resolves.not.toThrowError(NotFoundError);
    });

    it('should throw NotFoundError when comment not available', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyCommentAvailability(
          'thread-123',
          'comment-123',
          'user-123'
        )
      ).rejects.toThrowError(NotFoundError);
    });

    it('should throw AuthorizationError when user have no authorization', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-123',
      });
      await ThreadsTableTestHelper.addThread({
        owner: 'user-123',
      });

      const addComment = new AddComment({
        threadId: 'thread-123',
        content: 'content',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123'; // stub!

      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );
      // Action & Assert
      await commentRepositoryPostgres.addCommentInThread(addComment);
      await expect(
        commentRepositoryPostgres.verifyCommentAvailability(
          'thread-123',
          'comment-123',
          'user-234'
        )
      ).rejects.toThrowError(AuthorizationError);
    });

    it('should get comment', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
      });
      await ThreadsTableTestHelper.addThread({
        owner: 'user-123',
      });

      const addComment = new AddComment({
        threadId: 'thread-123',
        content: 'isi',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // // Action
      await commentRepositoryPostgres.addCommentInThread(addComment);
      const comment = await commentRepositoryPostgres.getCommentInThread({
        threadId: 'thread-123',
      });

      // Action & Assert
      await expect(
        commentRepositoryPostgres.getCommentInThread({ threadId: 'thread-123' })
      ).resolves.not.toThrowError(NotFoundError);
      expect(comment[0]).toStrictEqual({
        id: 'comment-123',
        username: 'dicoding',
        date: comment[0].date,
        content: 'isi',
        is_delete: null,
      });
    });
  });

  describe('addComment function', () => {
    it('should persist add thread and return added comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
      });
      await ThreadsTableTestHelper.addThread({
        owner: 'user-123',
      });

      const addComment = new AddComment({
        threadId: 'thread-123',
        content: 'content',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const resultAddComment =
        await commentRepositoryPostgres.addCommentInThread(addComment);
      const comments = await CommentsTableTestHelper.getDetailComment(
        'comment-123'
      );

      // Assert
      expect(
        await threadRepositoryPostgres.verifyThreadAvailability('thread-123')
      ).resolves;
      expect(resultAddComment).toStrictEqual({
        content: 'content',
        id: 'comment-123',
        owner: 'user-123',
        threadId: 'thread-123',
      });
      expect(comments).toHaveLength(1);
    });
  });

  describe('deleteComment function', () => {
    it('should persist add thread and return added comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
      });
      await ThreadsTableTestHelper.addThread({
        owner: 'user-123',
      });

      const addComment = new AddComment({
        threadId: 'thread-123',
        content: 'content',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123'; // stub!

      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await commentRepositoryPostgres.addCommentInThread(addComment);
      await commentRepositoryPostgres.deleteCommentInThread({
        threadId: 'thread-123',
        commentId: 'comment-123',
        owner: 'user-123',
      });
      const comments = await CommentsTableTestHelper.getDetailComment(
        'comment-123'
      );

      // Assert
      expect(comments[0].is_delete).toContain('1');
    });
  });
});
