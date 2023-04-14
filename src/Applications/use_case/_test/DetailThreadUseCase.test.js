const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DetailThreadUseCase = require('../DetailThreadUseCase');

describe('DetailThreadUseCase', () => {
  it('should not show deleted comment', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
    };
    const expectedDetailThread = {
      id: 'thread-123',
      title: 'title',
      body: 'content',
      date: '2023-03-24',
      username: 'user-123',
      comments: [
        {
          id: 'comment-123',
          username: 'user-123',
          content: 'keren',
          date: '2023-03-24',
        },
        {
          id: 'comment-122',
          username: 'user-122',
          content: '**komentar telah dihapus**',
          date: '2023-03-24',
        },
      ],
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.getDetailThread = jest.fn().mockImplementation(() =>
      Promise.resolve({
        id: 'thread-123',
        title: 'title',
        body: 'content',
        date: '2023-03-24',
        username: 'user-123',
      })
    );
    mockCommentRepository.getCommentInThread = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve([
          {
            id: 'comment-123',
            username: 'user-123',
            content: 'keren',
            is_delete: null,
            date: '2023-03-24',
          },
          {
            id: 'comment-122',
            username: 'user-122',
            content: 'dicoding',
            is_delete: '1',
            date: '2023-03-24',
          },
        ])
      );

    /** creating use case instance */
    const getDetailThreadUseCase = new DetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const result = await getDetailThreadUseCase.execute(useCasePayload);

    // Assert
    expect(result).toStrictEqual(expectedDetailThread);
    expect(mockThreadRepository.getDetailThread).toBeCalledWith(
      new DetailThread({
        threadId: useCasePayload.threadId,
      })
    );
    expect(mockCommentRepository.getCommentInThread).toBeCalledWith(
      new DetailThread({
        threadId: useCasePayload.threadId,
      })
    );
  });

  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
    };

    const expectedDetailThread = {
      id: 'thread-123',
      title: 'title',
      body: 'content',
      date: '2023-03-24',
      username: 'user-123',
      comments: [
        {
          id: 'comment-123',
          username: 'user-123',
          content: 'keren',
          date: '2023-03-24',
        },
        {
          id: 'comment-122',
          username: 'user-122',
          content: 'dicoding',
          date: '2023-03-24',
        },
      ],
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.getDetailThread = jest.fn().mockImplementation(() =>
      Promise.resolve({
        id: 'thread-123',
        title: 'title',
        body: 'content',
        date: '2023-03-24',
        username: 'user-123',
      })
    );
    mockCommentRepository.getCommentInThread = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve([
          {
            id: 'comment-123',
            username: 'user-123',
            content: 'keren',
            is_delete: null,
            date: '2023-03-24',
          },
          {
            id: 'comment-122',
            username: 'user-122',
            content: 'dicoding',
            is_delete: 1,
            date: '2023-03-24',
          },
        ])
      );

    /** creating use case instance */
    const getDetailThreadUseCase = new DetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const detailThread = await getDetailThreadUseCase.execute(useCasePayload);

    // Assert
    expect(detailThread).toStrictEqual(expectedDetailThread);
    expect(mockThreadRepository.getDetailThread).toBeCalledWith(
      new DetailThread({
        threadId: useCasePayload.threadId,
      })
    );
    expect(mockCommentRepository.getCommentInThread).toBeCalledWith(
      new DetailThread({
        threadId: useCasePayload.threadId,
      })
    );
  });
});
