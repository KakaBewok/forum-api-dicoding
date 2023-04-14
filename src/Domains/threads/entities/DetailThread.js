class DetailThread {
  constructor(payload) {
    this._verifyPayload(payload);

    const { threadId } = payload;

    this.threadId = threadId;
  }

  _verifyPayload({ threadId }) {
    if (!threadId) {
      throw new Error('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof threadId !== 'string') {
      throw new Error('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailThread;
