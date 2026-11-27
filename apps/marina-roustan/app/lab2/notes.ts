export const direction = {
    name: "C · Consulta",
    idea: "La persona y el lugar: un campo amarillo con el titular y las acciones, en qué ayuda, quién es Marina, opiniones, la consulta y una página de contacto que separa hablar de escribir.",
    look: "Young Serif para titulares, Hanken Grotesk para el texto. Blanco y arena alternos; el amarillo sol solo en la primera pantalla y la tinta azul marino en el texto y el pie.",
};

export const changes = [
    "El arco de la portada ya no repite los temas de abajo: ahora es un dibujo de la consulta, dos butacas frente a frente bajo el sol.",
    "Fuera “La primera vez”: los tres pasos describían cómo funciona cualquier cita, no nada propio de Marina.",
    "Una web normal, no una sola página: Inicio, Terapias, Sobre mí, Blog y Contacto, como la actual.",
    "Menú corto: Terapias, Sobre mí y Blog, más el botón “Pide cita”. El teléfono sale de la cabecera (está en el pie y en Contacto); en el móvil, todo bajo “Menú”.",
    "El blog vuelve: portada con los tres últimos artículos, una página con los diez y una página por artículo.",
    "“Sobre mí” es ahora la página de Marina: retrato, bio, datos, experiencia, formación, publicaciones y el CV en PDF.",
    "El retrato pasa a “Sobre mí”, en el mismo arco, junto a sus títulos.",
    "Opiniones: cada una se encabeza con una frase literal suya en la serif y el texto completo va en la sans, más fácil de leer.",
    "El currículum se convierte en una página, Formación y trayectoria, con el PDF completo para descargar.",
    "Sin línea de crisis: ni en el pie ni en el formulario.",
    "Datos del CV que la web actual no muestra: colegiada 7538 del COPC, especialista en Psicología Clínica, consulta propia desde 1994 e idiomas.",
    "Tomado de N y L+K: un aviso para quien llega derivado por un juzgado o un abogado, junto a “Cómo trabajo”.",
    "Tomado de N y L+K: el trabajo con cáncer como sección propia, como en L+K: banda azul marino, el libro grande a la izquierda y el texto a la derecha.",
    "Tomado de N: el formulario en la propia portada. Sin “¿Sobre qué quieres hablar?”: nombre, contacto y, si quiere, un mensaje.",
];

export const decisions = [
    {
        question: "¿Publicar el currículum?",
        answer: "Sí, pero no como hoy. Los directorios donde la gente compara psicólogos en España (Doctoralia, Psychology Today, Psicología y Mente) enseñan el número de colegiado y una bio corta, no un CV. A un paciente le sirven cinco datos comprobables, y van en “Sobre mí”. El PDF de 7 páginas, con congresos desde 1996, interesa a abogados y juzgados por su trabajo forense y de coordinación de parentalidad, así que se queda como descarga desde Formación y trayectoria.",
    },
];

export const toConfirm = [
    "Los tres pasos de “La primera vez” y “Te contesto yo”.",
    "Si atiende en los cinco idiomas del CV o solo los habla.",
    "El doctorado: la web dice “magna cum laude” y el CV “Excelente cum laude”; se usa el CV.",
    "“Esta web no usa cookies” depende de no añadir analítica.",
    "Su bio dice “más de 25 años” y el CV, consulta propia desde 1994 (32 años).",
    "Una foto de la consulta.",
];
