export const direction = {
    name: "C · Consulta",
    idea: "La persona y el lugar: un campo amarillo con el titular y las acciones, “La primera vez” en tres pasos, en qué ayuda, quién es Marina, opiniones, la consulta y una página de contacto que separa hablar de escribir.",
    look: "Young Serif para titulares, Hanken Grotesk para el texto. Blanco y arena alternos; el amarillo sol solo en la primera pantalla y la tinta azul marino en el texto y el pie.",
};

export const changes = [
    "Primera pantalla sin foto: el arco blanco que enmarcaba el retrato ahora pregunta “¿Qué te trae por aquí?” y lleva a cada tema explicado más abajo.",
    "El retrato pasa a “Sobre mí”, en el mismo arco, junto a sus títulos.",
    "Opiniones: cada una se encabeza con una frase literal suya en la serif y el texto completo va en la sans, más fácil de leer.",
    "El currículum se convierte en una página, Formación y trayectoria, con el PDF completo para descargar.",
    "La línea de crisis sale del pie de todas las páginas y pasa al formulario de contacto, como aviso de que no es para urgencias.",
    "Datos del CV que la web actual no muestra: colegiada 7538 del COPC, especialista en Psicología Clínica, consulta propia desde 1994 e idiomas.",
    "Tomado de N y L+K: un aviso para quien llega derivado por un juzgado o un abogado, junto a “Cómo trabajo”.",
    "Tomado de N y L+K: el trabajo con cáncer como sección propia, con el libro y el método GAFA, en lugar de una tarjeta bajo “Sobre mí”. Sin banda de color: sigue el blanco y arena del resto.",
    "Tomado de N: el formulario en la propia portada. Cada tema y cada botón llevan a él con el motivo ya marcado.",
];

export const decisions = [
    {
        question: "¿Publicar el currículum?",
        answer: "Sí, pero no como hoy. Los directorios donde la gente compara psicólogos en España (Doctoralia, Psychology Today, Psicología y Mente) enseñan el número de colegiado y una bio corta, no un CV. A un paciente le sirven cinco datos comprobables, y van en “Sobre mí”. El PDF de 7 páginas, con congresos desde 1996, interesa a abogados y juzgados por su trabajo forense y de coordinación de parentalidad, así que se queda como descarga desde Formación y trayectoria.",
    },
    {
        question: "¿Sirve el teléfono de crisis en el pie?",
        answer: "En el pie, poco: 2 de las 10 webs lo ponen, ninguna guía lo pide a una consulta privada y nadie en crisis lo busca ahí. Donde sí importa es en el formulario: alguien que lo está pasando muy mal puede escribir y esperar un día a la respuesta. Ahí va el aviso de que no es para urgencias, con el 024 (gratis, 24 horas, del Ministerio de Sanidad) y el 112.",
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
