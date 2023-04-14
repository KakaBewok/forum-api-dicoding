const AddComment = require('../../Domains/comments/entities/AddComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async _verifyPayload({ id, threadId }) {
    if (id === undefined || id === null) {
      throw new Error('ADD_COMMENT.NO_AUTHORIZATION');
    }
    if (threadId === undefined || threadId === null) {
      throw new Error('ADD_COMMENT.NO_PARAMS');
    }
  }

  async execute(useCasePayload, id, threadId) {
    await this._verifyPayload({ id, threadId });

    const addComment = new AddComment({
      owner: id,
      threadId,
      ...useCasePayload,
    });

    await this._threadRepository.verifyThreadAvailability(threadId);

    return this._commentRepository.addCommentInThread(addComment);
  }
}

module.exports = AddCommentUseCase;
