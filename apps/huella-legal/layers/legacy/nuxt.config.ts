const moved = (to: string) => ({ redirect: { to, statusCode: 301 as const } });

const PUBLISH = "/publicar-mi-articulo/";
const THESES = `${PUBLISH}publicar-tfm-tfg-derecho/`;

export default defineNuxtConfig({
    routeRules: {
        "/categorias/": moved("/areas/"),
        "/Categoria/**": moved("/areas/**"),
        "/Etiqueta/**": moved("/etiquetas/**"),
        "/author/**": moved("/colaboradores/**"),
        [PUBLISH]: moved("/publicar/"),
        [THESES]: moved("/publicar/"),
        [`${THESES}trabajos-de-fin-de-grado-y-master-publicados/`]: moved(
            "/etiquetas/trabajos-de-fin-de-grado/",
        ),
        "/noticias/": moved("/publicaciones/"),
        "/page/**": moved("/publicaciones/"),
        "/comments/feed/": moved("/feed/"),
        "/sitemap_index.xml": moved("/sitemap.xml"),
        "/post-sitemap.xml": moved("/sitemap.xml"),
        "/page-sitemap.xml": moved("/sitemap.xml"),
        "/author-sitemap.xml": moved("/sitemap.xml"),
        "/empieza-aqui/": moved("/sobre/"),
        "/recursos/": moved("/publicaciones/"),
        "/recursos/conecta/": moved("/contacto/"),
        "/chupitos-de-derecho/": moved("/publicaciones/"),
        "/listado-de-preguntas-y-respuestas/": moved("/publicaciones/"),
        "/consulta-legal-gratis/": moved("/contacto/"),
        "/suscripcion/": moved("/"),
    },
});
