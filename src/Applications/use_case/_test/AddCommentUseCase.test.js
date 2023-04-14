const AddComment = require('../../../Domains/comments/entities/AddComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'content',
      owner: 'user-123',
    };
    const useCaseParams = {
      threadId: 'thread-123',
    };
    const expectedComment = {
      id: 'comment-123',
      threadId: useCaseParams.threadId,
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    };

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadAvailability = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.addCommentInThread = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve({
          id: 'comment-123',
          threadId: useCaseParams.threadId,
          content: useCasePayload.content,
          owner: useCasePayload.owner,
        })
      );

    /** creating use case instance */
    const getCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedComment = await getCommentUseCase.execute(
      useCasePayload,
      useCasePayload.owner,
      useCaseParams.threadId
    );

    // Assert
    expect(addedComment).toStrictEqual(expectedComment);
    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith(
      useCaseParams.threadId
    );
    expect(mockCommentRepository.addCommentInThread).toBeCalledWith(
      new AddComment({
        threadId: useCaseParams.threadId,
        content: useCasePayload.content,
        owner: useCasePayload.owner,
      })
    );
  });

  it('should throw error if user id undefined', async () => {
    // Arrange
    const useCasePayload = {
      content: 'content',
    };
    const useCaseParams = {
      threadId: 'thread-123',
    };

    /** creating use case instance */
    const getCommentUseCase = new AddCommentUseCase({
      commentRepository: new CommentRepository(),
      threadRepository: new ThreadRepository(),
    });

    // Action & Assert
    await expect(
      getCommentUseCase.execute(
        useCasePayload,
        useCasePayload.owner,
        useCaseParams.threadId
      )
    ).rejects.toThrowError('ADD_COMMENT.NO_AUTHORIZATION');
  });

  it('should throw error if thread id undefined', async () => {
    // Arrange
    const useCasePayload = {
      content: 'content',
      owner: 'user-123',
    };
    const useCaseParams = {};

    /** creating use case instance */
    const getCommentUseCase = new AddCommentUseCase({
      commentRepository: new CommentRepository(),
      threadRepository: new ThreadRepository(),
    });

    // Assert
    await expect(
      getCommentUseCase.execute(
        useCasePayload,
        useCasePayload.owner,
        useCaseParams.threadId
      )
    ).rejects.toThrowError('ADD_COMMENT.NO_PARAMS');
  });
});
