// GET
// /businesses
// Lista paginada. Query params: page, limit, category, city.


// GET
// /businesses/featured
// Negocios destacados para Home y RecommendationSection (reemplaza mockBusinesses).


// GET
// /businesses/:id
// Detalle completo: info, rating promedio y coordenadas para el mapa Leaflet.


// POST
// /businesses
// Crea negocio al finalizar el wizard. Body: name, category, type, description, phone, lat, lng, image_url.
// solo seller


// PUT
// /businesses/:id
// Edita un negocio propio.
// solo seller


// DELETE
// /businesses/:id
// Elimina negocio (seller dueño o admin).
// solo seller