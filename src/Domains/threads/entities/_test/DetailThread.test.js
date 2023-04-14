const DetailThread = require('../DetailThread');

describe('DetailThread entities', () => {
  it('should throw error when payload does not contain needed property', () => {
    // Arrange
    const payload = {};

    // Action and Assert
    expect(() => new DetailThread(payload)).toThrowError(
      'DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      threadId: 123,
    };

    // Action and Assert
    expect(() => new DetailThread(payload)).toThrowError(
      'DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create DetailThread object correctly', () => {
    // Arrange
    const payload = {
      threadId: 'thisIsIDForDetailTread',
    };

    // Action
    const detailThread = new DetailThread(payload);

    // Assert
    expect(detailThread.threadId).toEqual(payload.threadId);
  });
});
