const Jwt = require('@hapi/jwt');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const AuthenticationError = require('../../../Commons/exceptions/AuthenticationError');
const JwtTokenManager = require('../JwtTokenManager');

describe('JwtTokenManager', () => {
  describe('createAccessToken function', () => {
    it('should create accessToken correctly', async () => {
      // Arrange
      const payload = {
        username: 'dicoding',
      };
      const mockJwtToken = {
        generate: jest.fn().mockImplementation(() => 'mock_token'),
      };

      const jwtTokenManager = new JwtTokenManager(mockJwtToken);

      // Action
      const accessToken = await jwtTokenManager.createAccessToken(payload);

      // Assert
      expect(mockJwtToken.generate).toBeCalledWith(
        payload,
        process.env.ACCESS_TOKEN_KEY
      );
      expect(accessToken).toEqual('mock_token');
    });
  });

  describe('createRefreshToken function', () => {
    it('should create refreshToken correctly', async () => {
      // Arrange
      const payload = {
        username: 'dicoding',
      };
      const mockJwtToken = {
        generate: jest.fn().mockImplementation(() => 'mock_token'),
      };
      const jwtTokenManager = new JwtTokenManager(mockJwtToken);

      // Action
      const refreshToken = await jwtTokenManager.createRefreshToken(payload);

      // Assert
      expect(mockJwtToken.generate).toBeCalledWith(
        payload,
        process.env.REFRESH_TOKEN_KEY
      );
      expect(refreshToken).toEqual('mock_token');
    });
  });

  describe('verifyRefreshToken function', () => {
    it('should throw InvariantError when verification failed', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(Jwt.token);
      const accessToken = await jwtTokenManager.createAccessToken({
        username: 'dicoding',
      });

      // Action & Assert
      await expect(
        jwtTokenManager.verifyRefreshToken(accessToken)
      ).rejects.toThrow(InvariantError);
    });

    it('should not throw InvariantError when refresh token verified', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(Jwt.token);
      const refreshToken = await jwtTokenManager.createRefreshToken({
        username: 'dicoding',
      });

      // Action & Assert
      await expect(
        jwtTokenManager.verifyRefreshToken(refreshToken)
      ).resolves.not.toThrow(InvariantError);
    });
  });

  describe('verifyAccessToken function', () => {
    it('should throw InvariantError when verification failed', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(Jwt.token);
      const accessToken = await jwtTokenManager.createRefreshToken({
        username: 'dicoding',
      });

      // Action & Assert
      await expect(
        jwtTokenManager.verifyAccessToken(accessToken)
      ).rejects.toThrow(InvariantError);
    });

    it('should not throw InvariantError when access token verified', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(Jwt.token);
      const refreshToken = await jwtTokenManager.createAccessToken({
        username: 'dicoding',
      });

      // Action & Assert
      await expect(
        jwtTokenManager.verifyAccessToken(refreshToken)
      ).resolves.not.toThrow(InvariantError);
    });
  });

  describe('getTokenFromHeader function', () => {
    it('should decode payload false', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(Jwt.token);

      // Action & Assert
      await expect(jwtTokenManager.getTokenFromHeader()).rejects.toThrow(
        AuthenticationError
      );
    });

    it('should decode payload correctly', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(Jwt.token);
      const accessToken = await jwtTokenManager.createAccessToken({
        username: 'dicoding',
      });

      // Action
      const token = await jwtTokenManager.getTokenFromHeader(
        `Bearer ${accessToken}`
      );

      // Action & Assert
      expect(token).toEqual(accessToken);
    });
  });

  describe('verifyTokenFromHeader function', () => {
    it('should decode payload false', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(Jwt.token);

      // Action & Assert
      await expect(jwtTokenManager.verifyTokenFromHeader()).rejects.toThrow(
        AuthenticationError
      );
    });

    it('should decode payload correctly', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(Jwt.token);
      const accessToken = await jwtTokenManager.createAccessToken({
        username: 'dicoding',
      });

      // Action
      const { username } = await jwtTokenManager.verifyTokenFromHeader(
        `Bearer ${accessToken}`
      );

      // Action & Assert
      expect(username).toEqual('dicoding');
    });
  });

  describe('decodePayload function', () => {
    it('should decode payload correctly', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(Jwt.token);
      const accessToken = await jwtTokenManager.createAccessToken({
        username: 'dicoding',
      });

      // Action
      const { username: expectedUsername } =
        await jwtTokenManager.decodePayload(accessToken);

      // Action & Assert
      expect(expectedUsername).toEqual('dicoding');
    });
  });
});
