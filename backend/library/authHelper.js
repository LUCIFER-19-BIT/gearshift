const getAuthenticatedUserId = (req) => req.user?.id || req.user?._id || null;

const ensureAuthenticatedUser = (req, res) => {
  const userId = getAuthenticatedUserId(req);
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return null;
  }
  return userId;
};

module.exports = {
  getAuthenticatedUserId,
  ensureAuthenticatedUser,
};
