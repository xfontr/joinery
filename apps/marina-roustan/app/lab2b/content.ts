// Round 2 of the lab. Facts come from ../lab/fixtures (the live site); anything marked
// `proposal` is new copy for Marina to confirm.
import { book, concerns, contact, intro, testimonials } from "../lab/fixtures";
import portrait from "../lab/images/portrait.png";

export { book, concerns, contact, intro, portrait };

export const voices = testimonials.filter((item) => !("invented" in item));

export const legalTopic = "Caso judicial o peritaje";

export const topics = [...concerns.map((item) => item.title), legalTopic, "Otra cosa"];

export const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Carrer del Comte d'Urgell 237, 08036 Barcelona")}`;

// What Marina does with each concern, from the live site's area texts, shortened.
export const concernDetail: Record<string, string> = {
    "Ansiedad y estrés":
        "La exigencia de cada día puede llevarnos a adaptarnos tanto que enfermamos. Trabajamos qué la sostiene y cómo bajar el ritmo sin que todo se caiga.",
    Pareja: "Un espacio para que los dos podáis escucharos de verdad, entender qué os está pasando y decidir cómo seguir.",
    Cáncer: "Terapia individual y en grupo para afrontar lo que la enfermedad deja en la vida y en el cuerpo.",
    "Después de un trauma":
        "El estrés postraumático aparece tras vivir algo que nos supera. Tratarlo a tiempo evita que los síntomas se cronifiquen.",
    "Familia y separación":
        "Como coordinadora de parentalidad, ayudo a gestionar el conflicto entre padres para que los hijos no queden en medio.",
    "Cuerpo y emociones":
        "Lo que sentimos y nuestra salud física se influyen. Desde la psiconeuroinmunología, miramos los dos a la vez.",
};

// Verbatim excerpts from each review, used as its heading.
export const voiceHeads: Record<string, string> = {
    "Roser Vidal": "Gran psicóloga, gran persona, muy humana.",
    "Joan Llibre": "Sin duda una terapeuta altamente recomendable.",
    "Marie-Eve Mounier": "Une grande professionnelle, avec beaucoup d’expérience…",
};

export const therapies = [
    { name: "Individual", line: "Sesiones a solas conmigo, al ritmo que necesites." },
    { name: "Pareja", line: "Los dos en la consulta, para entender qué os pasa." },
    { name: "Grupo", line: "Un grupo pequeño que se cuida y se escucha." },
    {
        name: "Coordinación de parentalidad",
        line: "Para familias separadas en conflicto, a menudo por indicación judicial.",
    },
];

export const slug = (text: string) =>
    text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z]+/g, "-");

// From Marina's CV (CV-Roustan-2026-27.pdf on the live site), which the live pages never show.
export const cvUrl = "https://marinaroustan.com/wp-content/uploads/2026/10/CV-Roustan-2026-27.pdf";

export const credentials = [
    { label: "Colegiada", value: "N.º 7538, Col·legi Oficial de Psicologia de Catalunya" },
    { label: "Especialista", value: "Psicóloga especialista en Psicología Clínica (2008)" },
    { label: "Doctorado", value: "Doctora en Psicología Clínica, UAB, cum laude (2010)" },
    { label: "Consulta propia", value: "En Barcelona desde 1994" },
    { label: "Idiomas", value: "Castellano, catalán, francés, inglés e italiano" },
    { label: "Centro sanitario", value: "N.º E08947240" },
];

export const trajectory = {
    education: [
        {
            year: "2010",
            text: "Doctorado en Psicología Clínica, Universitat Autònoma de Barcelona. Excelente cum laude; Título extraordinario de Excelencia Doctoral (2014)",
        },
        { year: "2008", text: "Título de Psicóloga Especialista en Psicología Clínica" },
        { year: "2008", text: "Psicoterapeuta acreditada y EuroPsy (EFPA), renovado en 2025" },
        {
            year: "2007",
            text: "Máster en Iniciación a la Investigación en Psicología, UAB. Excelente",
        },
        { year: "2004", text: "Máster en Neurociencias, Universitat Oberta de Catalunya" },
        { year: "2004", text: "Máster en Grupoanálisis, Universidad de Deusto" },
        {
            year: "2013",
            text: "Posgrado en Derecho de la Infancia, Protección de la Persona y Adopción, UB",
        },
        { year: "2018", text: "Advanced Parenting Coordination, William James College (EE. UU.)" },
        {
            year: "1992",
            text: "Licenciatura en Psicología (homologación), Universitat de Barcelona",
        },
    ],
    work: [
        {
            title: "Consulta propia",
            text: "Desde 1994: terapia individual, de pareja y de grupo, intervención familiar y atención a pacientes con cáncer.",
        },
        {
            title: "Psicología forense",
            text: "Informes periciales y su defensa en juicio, en juzgados civiles y sociales.",
        },
        {
            title: "Grupos de ayuda contra el cáncer de mama",
            text: "Creadora del método GAFA, publicado en 2011.",
        },
        {
            title: "Docencia",
            text: "UAB, UB, Universitat Ramon Llull y el Col·legi de l'Advocacia de Barcelona (ICAB).",
        },
    ],
    publications: [
        {
            year: "2020",
            text: "Niños en los procesos de divorcio. Manual de Derecho de Familia, Editorial Leblanc",
        },
        {
            year: "2015",
            text: "Inclusión de menores en mediación familiar. Papeles del Psicólogo, 36 (2)",
        },
        {
            year: "2013",
            text: "Sequential analysis of an interactive peer support group. Psicothema, 25 (3)",
        },
        { year: "2011", text: "El Método GAFA. Revista de Teoría y Práctica Grupoanalítica, 2" },
        { year: "2008", text: "Cáncer: cuando habla el cuerpo. Publi Corinti (libro)" },
    ],
    memberships:
        "Socia de la EFPA desde 2008 y de las secciones de Psicología Clínica y de la Salud, Psicología Jurídica, Psicoterapia y Resolución de Conflictos del COPC.",
};

export const proposal = {
    steps: [
        {
            title: "Me escribes o me llamas",
            body: "Por WhatsApp, por teléfono o con el formulario. Basta con una frase.",
        },
        {
            title: "Te contesto yo",
            body: "Buscamos una hora que te vaya bien, en la consulta del Eixample.",
        },
        {
            title: "Primera sesión",
            body: "Me cuentas qué te pasa, sin prisa, y vemos si puedo ayudarte y cómo.",
        },
    ],
    urgent: "Este formulario no es para urgencias: puedo tardar un día o dos en contestar. Si ahora mismo estás en peligro o piensas en hacerte daño, llama al 024 (gratis, 24 horas) o al 112.",
    cookies: "Esta web no usa cookies.",
};
