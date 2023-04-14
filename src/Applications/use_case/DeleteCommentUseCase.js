const DeleteComment = require('../../Domains/comments/entities/DeleteComment');

class DeleteCommentUseCase {
  constructor({ commentRepository, authenticationTokenManager }) {
    this._commentRepository = commentRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async _verifyPayload({ id, threadId, commentId }) {
    if (id === undefined || id === null) {
      throw new Error('DELETE_COMMENT.NO_AUTHORIZATION');
    }
    if (threadId === undefined || commentId === undefined) {
      throw new Error('DELETE_COMMENT.NO_PARAMS');
    }
  }

  async execute({ id, threadId, commentId }) {
    await this._verifyPayload({ id, threadId, commentId });

    const deleteComment = new DeleteComment({ owner: id, threadId, commentId });

    await this._commentRepository.verifyCommentAvailability(
      threadId,
      commentId,
      id
    );

    await this._commentRepository.deleteCommentInThread(deleteComment);
  }
}

module.exports = DeleteCommentUseCase;
