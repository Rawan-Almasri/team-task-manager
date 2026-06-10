export const authorizeTeamMember = (
  membership,
  allowedRoles = [],
  options = {}
) => {
  const {
    allowOwner = true,
    message = "You are not allowed to perform this action",
  } = options;

  if (!membership) {
    throw new AppError("You are not a member of this team", 403);
  }

  const isOwner = allowOwner && membership.isOwner === true;
  const hasAllowedRole = allowedRoles.includes(membership.role);

  if (!isOwner && !hasAllowedRole) {
    throw new AppError(message, 403);
  }

  return true;
};

export const authorizeTeamOwner = (
  membership,
  message = "Only team owner can perform this action"
) => {
  if (!membership || membership.isOwner !== true) {
    throw new AppError(message, 403);
  }

  return true;
};