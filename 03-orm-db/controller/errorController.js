export function notFound(req, res) {
    res.status(404).json({ error: "Страница не найдена" });
}
