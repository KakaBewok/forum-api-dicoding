const AddThread = require('../../../Domains/threads/entities/AddThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'title',
      body: 'content',
      owner: 'user-001',
    };
    const idUser = {
      id: 'user-001',
    };
    const expectedThread = {
      id: 'thread-123',
      title: 'title',
      body: 'content',
      owner: 'user-001',
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.addThread = jest.fn().mockImplementation(() =>
      Promise.resolve({
        id: 'thread-123',
        title: 'title',
        body: 'content',
        owner: 'user-001',
      })
    );

    /** creating use case instance */
    const getThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedThread = await getThreadUseCase.execute(
      useCasePayload,
      idUser.id
    );

    // Assert
    expect(addedThread).toStrictEqual(expectedThread);
    expect(mockThreadRepository.addThread).toBeCalledWith(
      new AddThread({
        title: useCasePayload.title,
        body: useCasePayload.body,
        owner: useCasePayload.owner,
      })
    );
  });

  it('should orchestrating the add thread action no contain authorization', async () => {
    // Arrange
    const useCasePayload = {
      title: 'title',
      body: 'content',
    };

    const idUser = {};

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** creating use case instance */
    const getThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Assert
    await expect(
      getThreadUseCase.execute(useCasePayload, idUser.id)
    ).rejects.toThrowError('ADD_THREAD.NO_AUTHORIZATION');
  });
});
