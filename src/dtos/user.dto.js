export const userResponseDto = (user) => {
  if (!user) return null;

  const { password, ...safeUser } = user;

  return safeUser;
};


export const usersResponseDto = (users = []) => {
  return users.map(userResponseDto);
};
