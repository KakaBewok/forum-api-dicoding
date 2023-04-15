const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const CommentRepository = require('../../Domains/comments/CommentRepository');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async verifyCommentAvailability(threadId, commentId, owner) {
    const query = {
      text: 'SELECT * FROM comments WHERE "threadId" = $1 AND id = $2',
      values: [threadId, commentId],
    };

    const comment = await this._pool.query(query);

    if (comment.rowCount < 1) {
      throw new NotFoundError('komentar tidak ditemukan');
    }

    if (comment.rows[0].owner !== owner) {
      throw new AuthorizationError('autorisasi salah');
    }
  }

  async addCommentInThread(comment) {
    const { threadId, content, owner } = comment;

    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4) RETURNING id, "threadId", content, owner',
      values: [id, threadId, content, owner],
    };

    const result = await this._pool.query(query);

    return { ...result.rows[0] };
  }

  async getCommentInThread(id) {
    const { threadId } = id;

    const query = {
      text: 'SELECT comments.id, "username", "createdAt" AS date, content, is_delete FROM comments JOIN users ON users.id = comments.owner WHERE comments."threadId" = $1',
      values: [threadId],
    };

    const comment = await this._pool.query(query);

    return [...comment.rows];
  }

  async deleteCommentInThread(deleteComment) {
    const { threadId, commentId, owner } = deleteComment;

    const query = {
      text: 'UPDATE comments SET is_delete = $4 WHERE "threadId" = $1 AND id = $2 AND owner = $3',
      values: [threadId, commentId, owner, '1'],
    };

    await this._pool.query(query);
  }
}

module.exports = CommentRepositoryPostgres;
