module.exports = async (req, res) => {
  const { default: apiProxy } = await import('../frontend/ifs24018-pabwe2026-proyek1/api/[...path].js');
  return apiProxy(req, res);
};
