const AddComment = require('../AddComment');

describe('AddComment entities', () => {
  it('should throw error when payload does not contain needed property', () => {
    // Arrange
    const payload = {
      threadId: 'id',
      owner: 'user-001',
    };

    // Action & Assert
    expect(() => new AddComment(payload)).toThrowError(
      'ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      threadId: 'id',
      content: 123,
      owner: 123,
    };

    // Action & Assert
    expect(() => new AddComment(payload)).toThrowError(
      'ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should throw error when content contains more than 100 character', () => {
    // Arrange
    const payload = {
      threadId: 'This is thread ID',
      owner: 'user-001',
      content:
        'dicodingindonesiadicodingindonesiadicodingindonesiadicodingdicodingindonesiadicodingindonesiadicodingindonesiadicodingdicodingindonesiadicodingindonesia',
    };

    // Action and Assert
    expect(() => new AddComment(payload)).toThrowError(
      'ADD_COMMENT.CONTENT_LIMIT_CHAR'
    );
  });

  it('should create AddComment entities correctly', () => {
    // Arrange
    const payload = {
      threadId: 'This is thread ID',
      content: 'My comment',
      owner: 'user-001',
    };

    // Action
    const addComment = new AddComment(payload);

    // Assert
    expect(addComment.threadId).toEqual(payload.threadId);
    expect(addComment.content).toEqual(payload.content);
    expect(addComment.owner).toEqual(payload.owner);
  });
});
