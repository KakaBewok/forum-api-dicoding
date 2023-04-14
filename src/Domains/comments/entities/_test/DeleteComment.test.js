const DeleteComment = require('../DeleteComment');

describe('DeleteComment entities', () => {
  it('should throw error when payload does not contain needed property', () => {
    // Arrange
    const payload = {
      threadId: 'This is thread ID',
      owner: 'user-001',
    };

    // Action & Assert
    expect(() => new DeleteComment(payload)).toThrowError(
      'DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      commentId: 'This is comment ID',
      threadId: 123,
      owner: 123,
    };

    // Action & Assert
    expect(() => new DeleteComment(payload)).toThrowError(
      'DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create deleteComment entities correctly', () => {
    // Arrange
    const payload = {
      commentId: 'comment-111',
      threadId: 'thread-222',
      owner: 'user-001',
    };

    // Action
    const deleteComment = new DeleteComment(payload);

    // Assert
    expect(deleteComment.commentId).toEqual(payload.commentId);
    expect(deleteComment.threadId).toEqual(payload.threadId);
    expect(deleteComment.owner).toEqual(payload.owner);
  });
});
