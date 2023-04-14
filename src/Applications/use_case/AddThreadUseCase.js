const AddThread = require('../../Domains/threads/entities/AddThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async _verifyPayload(id) {
    if (!id) {
      throw new Error('ADD_THREAD.NO_AUTHORIZATION');
    }
  }

  async execute(useCasePayload, id) {
    await this._verifyPayload(id);

    const addThread = new AddThread({ owner: id, ...useCasePayload });

    return this._threadRepository.addThread(addThread);
  }
}

module.exports = AddThreadUseCase;
