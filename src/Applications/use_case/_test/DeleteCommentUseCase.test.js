const DeleteComment = require('../../../Domains/comments/entities/DeleteComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const idUser = {
      id: 'user-123',
    };

    const useCaseParams = {
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockCommentRepository.verifyCommentAvailability = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteCommentInThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    await deleteCommentUseCase.execute({
      id: idUser.id,
      threadId: useCaseParams.threadId,
      commentId: useCaseParams.commentId,
    });

    // Assert
    expect(mockCommentRepository.verifyCommentAvailability).toBeCalledWith(
      useCaseParams.threadId,
      useCaseParams.commentId,
      idUser.id
    );
    expect(mockCommentRepository.deleteCommentInThread).toBeCalledWith(
      new DeleteComment({
        threadId: useCaseParams.threadId,
        commentId: useCaseParams.commentId,
        owner: idUser.id,
      })
    );
  });

  it('should throw error if authorization undefined', async () => {
    // Arrange
    const idUser = {};

    const useCaseParams = {
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockCommentRepository.deleteCommentInThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Assert
    await expect(
      deleteCommentUseCase.execute({
        id: idUser.id,
        threadId: useCaseParams.threadId,
        commentId: useCaseParams.commentId,
      })
    ).rejects.toThrowError('DELETE_COMMENT.NO_AUTHORIZATION');
  });

  it('should throw error if threadId undefined', async () => {
    // arrange
    const idUser = {
      id: 'user-123',
    };

    const useCaseParams = {
      commentId: 'comment-123',
    };

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockCommentRepository.deleteCommentInThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Assert
    await expect(
      deleteCommentUseCase.execute({
        id: idUser.id,
        threadId: useCaseParams.threadId,
        commentId: useCaseParams.commentId,
      })
    ).rejects.toThrowError('DELETE_COMMENT.NO_PARAMS');
  });
});
