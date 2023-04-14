const DetailThread = require('../../Domains/threads/entities/DetailThread');

class DetailThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async _filterDeletedComment(thread) {
    const { id, title, body, date, username } = thread;

    const data = {
      id,
      title,
      body,
      date,
      username,
      comments: [],
    };

    thread.comments.forEach((comment) => {
      const specialComments = comment;
      if (comment.is_delete === '1') {
        // eslint-disable-next-line no-param-reassign
        specialComments.content = '**komentar telah dihapus**';
      }
      delete specialComments.is_delete;

      data.comments.push(comment);
    });

    return data;
  }

  async execute(useCaseParams) {
    const detailThreadID = new DetailThread(useCaseParams);

    const thread = await this._threadRepository.getDetailThread(detailThreadID);

    const comments = await this._commentRepository.getCommentInThread(
      detailThreadID
    );

    thread.comments = comments;

    const data = await this._filterDeletedComment(thread);

    return data;
  }
}

module.exports = DetailThreadUseCase;
