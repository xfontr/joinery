import avisoLegal from "./content/aviso-legal.html?raw";
import estrategias from "./content/estrategias.html?raw";
import etica from "./content/etica-psicoterapia.html?raw";
import libroCancer from "./content/libro-cancer.html?raw";
import servicios from "./content/servicios.html?raw";
import ansiedad from "./images/ansiedad.png";
import cancer from "./images/cancer.png";
import estres from "./images/estres.png";
import estetica from "./images/estetica.jpg";
import eticaImage from "./images/etica.jpg";
import gafa from "./images/gafa.jpg";
import grupal from "./images/grupal.png";
import individual from "./images/individual.png";
import libro from "./images/libro.png";
import mediador from "./images/mediador.jpg";
import pareja from "./images/pareja.png";
import parentalidad from "./images/parentalidad.png";
import portrait from "./images/portrait.png";
import psiconeuro from "./images/psiconeuro.png";
import tept from "./images/tept.png";

export type Direction = "d" | "e" | "f" | "g" | "h" | "i" | "j" | "k" | "l" | "lk" | "n" | "o";

export const directions: { id: Direction; name: string; idea: string }[] = [
    {
        id: "d",
        name: "Claro",
        idea: "Swiss-modern and type-led: one sans family, a full-height hero with one action, Marina right after the fold, therapies as an open list, the book as proof.",
    },
    {
        id: "e",
        name: "Cálido",
        idea: "Editorial and warm: a serif display on sand with navy ink, centred statements, the portrait on a baseline beside her own words, quotes set like a magazine.",
    },
    {
        id: "f",
        name: "Cita",
        idea: "C's hero carried forward: a deep navy opening with one action, a tall credential band, short therapy rows, and a form built for a first message.",
    },
    {
        id: "g",
        name: "Claro + Cita",
        idea: "D's hero, therapies, book, testimonials and publications, with F's blue credential band, F's \"Hola, soy Marina\", F's split contact and F's footer.",
    },
    {
        id: "h",
        name: "Sereno",
        idea: "E's serif hero and centred contact form moved onto D's pale blue and navy, with F's band, F's \"Hola\" and F's therapy rows.",
    },
    {
        id: "i",
        name: "Cita viva",
        idea: "F's navy hero brought to life with a real testimonial and the consulta's address beside the action, then the favourite sections of D and F.",
    },
    {
        id: "j",
        name: "Sereno · motivo ★",
        idea: "H reworked for a first message: a hero that fits one screen, the visitor's reason before Marina's methods with each reason opening the form already chosen, Marina on a tinted band, the book as the cancer work on navy, publications, testimonials right before the form, a call bar on phones.",
    },
    {
        id: "k",
        name: "Sereno · Marina ★",
        idea: "J's fixes with Marina first: a left-set serif hero with a patient's words beside it, then \"Hola, soy Marina\", then the reasons people come.",
    },
    {
        id: "l",
        name: "Claro · motivo ★",
        idea: "D carried further with J's best idea: D's hero and type, the credential band, the visitor's reason as D-style open rows that start the form already chosen, F's Hola, the cancer work as the book's band, testimonials right before a contact that also offers call, WhatsApp and directions.",
    },
    {
        id: "lk",
        name: "L+K",
        idea: "K's order and content in L's visual language: a hero with a patient's words beside it and the trust band closing the first screen, Marina before the reasons, the reasons as open rows, the cancer work, two testimonials, and a side-by-side contact.",
    },
    {
        id: "n",
        name: "N",
        idea: "Everything the review taught, in one page: D's hero with serif italic accents and a patient's words in its closing row, the trust band, F's Hola, reasons that open into how Marina works on each and start the form, the cancer work, testimonials, and a split contact with every way to reach her.",
    },
    {
        id: "o",
        name: "O",
        idea: "N refined with J's order: one first screen with the action on the reading path and a patient's words as a pull-quote, the reasons straight after it, Marina on a tinted band signing her own letter, the cancer work, publications, all three testimonials, N's contact, one spacing rhythm throughout.",
    },
];

// One list drives the concern rows and the form's chips, so a row can open the form preselected.
export const concerns = [
    {
        topic: "Ansiedad o estrés",
        title: "Ansiedad y estrés",
        body: "Cuando la exigencia no para y el cuerpo empieza a avisar.",
    },
    {
        topic: "Pareja",
        title: "Pareja",
        body: "Para entender qué os está pasando y decidir cómo seguir.",
    },
    {
        topic: "Cáncer",
        title: "Cáncer",
        body: "Más de 15 años acompañando a pacientes con cáncer, en sesiones individuales y en grupo.",
    },
    {
        topic: "Trauma",
        title: "Después de un trauma",
        body: "Tratar los síntomas a tiempo evita que se cronifiquen.",
    },
    {
        topic: "Familia y parentalidad",
        title: "Familia y separación",
        body: "Cuando los hijos quedan en medio del conflicto entre sus padres.",
    },
    {
        topic: "Cuerpo y emociones",
        title: "Cuerpo y emociones",
        body: "Cómo se relacionan lo que sientes y tu salud física.",
    },
];

export const concernTopics = [...concerns.map((item) => item.topic), "Otro motivo"];

export const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Carrer del Comte d'Urgell 237, 08036 Barcelona")}`;

export const labPages = [
    { path: "", name: "Inicio" },
    { path: "/contacto", name: "Contacto" },
];

// Lab copy proposals; facts come only from the live site.
export const copy = {
    title: "Cuando lo que sientes empieza a pesar más que lo que vives",
    sub: "Terapia individual, de pareja y de grupo en el Eixample de Barcelona, con más de 25 años de consulta.",
    primary: "Pide cita",
    therapiesTitle: "En qué puedo ayudarte",
    voicesTitle: "Quienes ya han venido",
    writingTitle: "Publicaciones",
    contactTitle: "Escríbeme",
    contactSub: "Cuéntame qué te trae y cómo prefieres que te conteste.",
    topics: ["Ansiedad o estrés", "Pareja", "Familia y parentalidad", "Cáncer", "Otro motivo"],
};

export const facts = [
    { figure: "+25", label: "años de consulta" },
    { figure: "+200", label: "pacientes" },
    { figure: "Dra.", label: "Doctorado magna cum laude, UAB" },
    { figure: "2", label: "másteres: neurociencias y grupoanálisis" },
];

export const book = {
    title: "Cáncer: cuando habla el cuerpo",
    body: "Un estudio sobre la resiliencia ante el cáncer a partir de las historias de vida de cuatro mujeres, y sobre cómo convertirlo en intervenciones que respeten a cada paciente.",
    image: libro,
};

export const contact = {
    name: "Dra. Marina Roustan",
    role: "Psicóloga en Barcelona",
    phone: "+34 696 444 088",
    phoneHref: "tel:+34696444088",
    whatsapp:
        "https://wa.me/34696444088?text=Hola,%20me%20gustar%C3%ADa%20concertar%20una%20cita.%20Gracias.",
    email: "marinaroustan@marinaroustan.com",
    address: "C/ Comte d'Urgell, 237, 7º 3ª",
    city: "08036 Barcelona",
    registry: "Centro Sanitario n.º E08947240",
    motto: "Si una sola persona hace feliz a otra todo el mundo sería feliz",
};

export const nav = [
    { label: "Sobre mí", anchor: "sobre-mi" },
    { label: "Terapias", anchor: "terapias" },
    { label: "Publicaciones", anchor: "publicaciones" },
];

export const hero = {
    kicker: "Dra. Marina Roustan · Barcelona",
    title: "Te ayudo a desarrollar todo tu potencial",
    lead: "La Dra. Roustan es psicóloga clínica y forense en Barcelona con Centro Sanitario n.º E08947240.",
    proof: "+25 años generando confianza entre +200 pacientes",
    portrait,
};

export const intro = {
    greeting: "¡Hola!",
    body: [
        "Soy Marina, psicóloga clínica, forense, psicoterapeuta individual y grupal y coordinadora de parentalidad, en la ciudad de Barcelona.",
        "Llevo más de 25 años ayudando a otras personas a alcanzar la mejor versión de sí mismos, luchando contra los problemas y miedos con los que todos cargamos.",
    ],
    credentials: [
        "Doctorado magna cum laude (UAB)",
        "Máster en neurociencias (UOC)",
        "Máster en grupoanálisis (UD)",
    ],
    cv: "Ver currículum completo",
};

export const services = [
    {
        title: "Terapia individual",
        lead: "Relación asistencial calibrada en el paciente.",
        body: "Interrelacionar los aspectos psíquicos, sociales, personales y éticos que concurren en el paciente, y garantizar el mejor tratamiento basado en la evidencia y la subjetividad.",
        image: individual,
    },
    {
        title: "Terapia grupal",
        lead: "Una oportunidad única y privilegiada por medio de la palabra y de la comunicación, de cuidar de uno mismo y de los demás, mejorar su vida y ser más feliz.",
        body: "En un mundo donde las personas pierden sus puntales y sus pilares devienen borrosos, la pasarela grupal se vislumbra como la única salida firme y segura para volver a focalizar las energías dispersas.",
        image: grupal,
    },
    {
        title: "Coordinación de parentalidad",
        lead: "Con la Coordinación de Parentalidad aliviamos el peso que cargan los tribunales, y ayudamos a los niños inmersos entre sus padres.",
        body: "El trabajo del Coordinador de Parentalidad consiste en gestionar el conflicto, enseñar recursos, y contener la parte emocional duramente afectada, necesitando de destreza, sensibilidad y conocimiento del desarrollo infantil.",
        image: parentalidad,
    },
];

export const areas = [
    {
        title: "Gestión del estrés",
        body: "Atrapado en el impasse de nuestra era, la del algoritmo de Google y del pronóstico de la soledad, el ser humano ya no puede escapar.",
        icon: estres,
    },
    {
        title: "Problemas de ansiedad",
        body: "La era moderna se halla repleta de exigencias, deberes, frustraciones y mandatos, lo que provoca que a menudo nos sintamos abocados a una sobreadaptación enfermiza.",
        icon: ansiedad,
    },
    {
        title: "Problemas de pareja",
        body: "Si la aspiración a la felicidad se alcanza, en su plenitud, con la convivencia en el amor, entonces hay que entender que el matrimonio da esta oportunidad de amar y ser amado.",
        icon: pareja,
    },
    {
        title: "Ayuda contra el cáncer",
        body: "Llevo más de 15 años realizando terapias individuales y en grupo para afrontar las consecuencias psicológicas de sufrir cáncer.",
        icon: cancer,
    },
    {
        title: "Psiconeuroinmunología",
        body: "Las interacciones entre la mente y el sistema inmune. Consideramos la salud como una armonización biopsicológica.",
        icon: psiconeuro,
    },
    {
        title: "Trastorno postraumático (TEPT)",
        body: "Se desarrolla tras experimentar un trauma. Es mejor tratar la sintomatología para que no se cronifique en el tiempo.",
        icon: tept,
    },
];

export const testimonials = [
    {
        name: "Roser Vidal",
        lang: "es",
        text: "Excelente profesional, sumamente empática y rigurosa con su trabajo. Hace tiempo que acudo a su consulta y representa para mí un gran apoyo, psicológico y humano. Gran psicóloga, gran persona, muy humana.",
    },
    {
        name: "Joan Llibre",
        lang: "es",
        text: "Llevo años realizando terapia con la Dra. Roustan. El proceso ha ido tan bien que he querido seguir para afrontar otros retos de mi vida, y estoy muy satisfecho con la evolución. Sin duda una terapeuta altamente recomendable.",
    },
    {
        name: "Marie-Eve Mounier",
        lang: "fr",
        text: "Une grande professionnelle, avec beaucoup d’expérience, qui sait accompagner sur le chemin de la vie et aide à découvrir les forces en nous qui nous permettent de surmonter tous les obstacles.",
    },
    // Invented for the lab at the owner's request; replace with real reviews before launch.
    {
        name: "Laura M.",
        lang: "es",
        invented: true,
        text: "Llegué con una ansiedad que no me dejaba dormir y sin saber muy bien qué me pasaba. Marina me ayudó a entenderlo sin prisas y con mucho respeto. Hoy vivo mucho más tranquila.",
    },
    {
        name: "Jordi P.",
        lang: "es",
        invented: true,
        text: "Mi mujer y yo fuimos a terapia de pareja cuando ya casi no nos hablábamos. Nos dio un espacio para escucharnos de verdad. No sé dónde estaríamos sin esas sesiones.",
    },
];

export interface Post {
    slug: string;
    title: string;
    date: string;
    lang: "es" | "en";
    excerpt: string;
    image?: string;
    body?: string;
}

export const posts: Post[] = [
    {
        slug: "estrategias-comunicativas-en-familias-de-alta-conflictividad",
        title: "Estrategias comunicativas en familias de alta conflictividad",
        date: "2024-06-02",
        lang: "es",
        excerpt:
            "Este artículo ofrece una guía de ayuda para intervención profesional de coordinación de parentalidad CP.",
        body: estrategias,
    },
    {
        slug: "etica-psicoterapia",
        title: "Ética y deontología en psicoterapia",
        date: "2020-05-24",
        lang: "es",
        excerpt:
            "Una psicoterapia de calidad debe ser como un arte que sabe extraer la esencia de las cosas que plasma.",
        image: eticaImage,
        body: etica,
    },
    {
        slug: "metodo-gafa",
        title: "El Método GAFA",
        date: "2020-05-24",
        lang: "es",
        excerpt:
            "Construir la resiliencia, la perspectiva de futuro y la conciencia interpersonal en una terapia grupal con mujeres con cáncer de mama.",
        image: gafa,
    },
    {
        slug: "mediador-familiar",
        title: "Rol del mediador familiar: Reflexión sobre la formación en competencias comunicativas",
        date: "2020-05-24",
        lang: "es",
        excerpt:
            "La creciente conflictividad en las relaciones sociales llevó a la Unión Europea a la creación de un libro verde para hallar soluciones alternativas a la resolución judicial.",
        image: mediador,
    },
    {
        slug: "interactive-peer-support",
        title: "Sequential analysis of an interactive peer support group",
        date: "2020-05-24",
        lang: "en",
        excerpt:
            "A therapeutic matrix for women who had survived breast cancer was designed by combining interactive peer support with the exploratory approach of group therapy.",
    },
    {
        slug: "ayuda-contra-cancer",
        title: "Ayuda contra el cáncer",
        date: "2020-05-24",
        lang: "es",
        excerpt:
            "El cuerpo tiene que «constituirse» después del cáncer, así como la persona que albergó la enfermedad tiene que normalizar su vida y reorganizarse.",
    },
    {
        slug: "competencias-valorativas-psicologo",
        title: "Competencias valorativas y éticas del psicólogo forense",
        date: "2020-05-24",
        lang: "es",
        excerpt:
            "La posición del análisis en el ámbito forense es necesaria si se trata de determinar el grado de responsabilidad.",
    },
    {
        slug: "family-mediation",
        title: "The inclusion of children in family mediation",
        date: "2020-05-20",
        lang: "en",
        excerpt:
            "Mediation is an established model for conflict resolution, backed by the international community in relation to family law.",
    },
    {
        slug: "group-communication-analysis",
        title: "Group communication analysis",
        date: "2020-05-20",
        lang: "en",
        excerpt:
            "One year experience of an interactive support therapeutic group based on communication and analytical, educational and welfare-work axes.",
    },
    {
        slug: "estetica-corporal",
        title: "Estética corporal y equilibrio emocional",
        date: "2020-05-20",
        lang: "es",
        excerpt:
            "¿Podemos decir que la belleza y la estética corporal son un síndrome de nuestra sociedad?",
        image: estetica,
    },
];

export const standardPages: Record<
    string,
    { title: string; lead?: string; body: string; image?: string }
> = {
    servicios: {
        title: "Servicios",
        lead: "Terapia individual, de grupo y de pareja, coordinación de parentalidad y medicina psicosomática.",
        body: servicios,
    },
    "libro-cancer": {
        title: "Cáncer: cuando habla el cuerpo",
        lead: "Un libro de la Dra. Marina Roustan sobre la resiliencia ante el cáncer.",
        body: libroCancer,
        image: libro,
    },
    "aviso-legal": { title: "Aviso legal", body: avisoLegal },
};

export const formatDate = (iso: string) =>
    new Date(`${iso}T12:00:00`).toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

export const year = (iso: string) => iso.slice(0, 4);
