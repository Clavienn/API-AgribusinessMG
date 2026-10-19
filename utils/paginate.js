const MAX_LIMIT = 100;

// Pagination optionnelle : active seulement si ?page ou ?limit est fourni.
// La réponse reste un tableau ; le total est exposé via les en-têtes
// X-Total-Count, X-Page, X-Limit, X-Total-Pages.
export const paginated = async (req, res, Model, filter, query) => {
  if (req.query.page === undefined && req.query.limit === undefined) return query;

  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), MAX_LIMIT);
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);

  // Tri stable obligatoire pour que les pages ne se chevauchent pas
  if (!query.getOptions().sort) query.sort({ _id: 1 });

  const [items, total] = await Promise.all([
    query.skip((page - 1) * limit).limit(limit),
    Model.countDocuments(filter),
  ]);

  res.set({
    'X-Total-Count': total,
    'X-Page': page,
    'X-Limit': limit,
    'X-Total-Pages': Math.ceil(total / limit),
  });
  return items;
};
