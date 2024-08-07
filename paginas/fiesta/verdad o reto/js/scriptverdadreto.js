const verdades = [
    '¿A qué edad perdiste la virginidad?',
    '¿Alguna vez te has acostado con alguien mayor que tú?',
    '¿Alguna vez has tenido fantasías con alguien que no deberías?',
    '¿Qué piensas de los juguetes a la hora de tener intimidad?',
    '¿Cuál es el sitio más raro en el que lo has hecho?',
    '¿Cuál es el máximo de veces que lo has hecho en un día?',
    '¿Qué puntuación te darías tú del 1 al 10?',
    '¿Alguna vez te has acostado con alguien menor que tú?',
    '¿Cuál es tu posición favorita?',
    '¿Con quién de esta habitación has fantaseado para tener relaciones?',
    '¿Te has tocado en el mismo cuarto que otras personas cuando todos están dormidos?',
    '¿Con cuántos contactos de los que tienes en tu teléfono has tenido algún tipo de contacto íntimo?',
    '¿Cómo fue tu primera vez?',
    'Si comparas tus habilidades en la cama con un fenómeno natural, ¿cuál escogerías?',
    '¿Te han pillado tus padres en alguna ocasión?',
    '¿Te arrepientes de haberte acostado con alguien?',
    '¿Corto o largo?',
    '¿Rápido o lento?',
    '¿Tienes algún fetiche?',
    '¿Cada cuánto te masturbas?',
    '¿Te gustaría ver a tu pareja mientras se toca?',
    '¿Cuántas parejas íntimas has tenido?',
    '¿Has tenido relaciones en un coche?',
    '¿Qué es lo que buscas de un amante en la cama?',
    '¿Crees que el tamaño importa?',
    '¿Tienes alguna experiencia inconfesable?',
    '¿Te gusta que te aten?',
    '¿Cuál ha sido tu experiencia más ridícula en la cama?',
    '¿Qué es lo que más te molesta de otra persona en la cama?',
    'Si pudieras ser del sexo opuesto durante un día entero, ¿qué harías?',
    '¿Alguna vez has hecho un trío?',
    '¿A quién no te gustaría ver desnudo?',
    '¿Te gusta con las luces encendidas o apagadas?',
    '¿Has engañado a alguna de tus parejas?',
    '¿Serías capaz de estar desnudo en público?',
    '¿Te gustaría hacer intercambio de parejas?',
	'¿Harías un intercambio de parejas?',
	'¿Alguna vez has tenido una aventura de una noche?',
	'¿Cuál es el lugar más inusual en el que te has masturbado?',
	'¿Te has enamorado alguna vez de una persona con la que solo has tenido encuentros sexuales?',
	'¿Alguna vez has mentido sobre tu experiencia sexual para impresionar a alguien?',
	'¿Tienes alguna fantasía sexual que aún no has cumplido?',
	'¿Cuál ha sido el comentario más extraño o divertido que has recibido sobre tu vida sexual?',
	'¿Has tenido alguna vez un sueño sexual con una persona famosa? ¿Con quién?',
	'¿Has participado alguna vez en una conversación o chat de contenido sexual?',
	'¿Hay algo en tu vida sexual que desearías haber hecho de manera diferente?',
	'¿Cuál ha sido el lugar más inusual en el que te has sentido atraído por alguien?',
	'¿Alguna vez has tenido un sueño sexual sobre un compañero de trabajo o de clase?',
	'¿Has enviado alguna vez fotos o mensajes íntimos a alguien que no conocías bien?',
	'¿Qué es lo más atrevido que has hecho para conquistar a alguien?',
	'¿Cuál es la mayor sorpresa que has recibido en una relación íntima?',
	'¿Alguna vez has tenido una fantasía que te parezca vergonzosa? ¿Cuál es?',
	'¿Alguna vez has tenido una conversación sobre sexo que te haya hecho sentir incómodo o avergonzado?',
];

const retos = [
    'Quitarse las cuatro prendas de ropa que elija el afectado.',
    'Quedarse en ropa interior delante de todos durante 3 minutos.',
    'Envía un mensaje vergonzoso a un amigo.',
    'Demuestra un talento oculto que tengas.',
    'SHHH!!! Hacer ver a alguien que estás ligando con él o con ella.',
    'Admite cuál es el mayor ridículo que has hecho nunca.',
    'Hazte pasar por otra persona durante las siguientes 2 rondas del juego.',
	'Déjate vendar los ojos y trata de adivinar qué objeto te están mostrando solo con el tacto.',
	'SHHH!!! Elige a alguien y dale un beso en el cuello.',
	'Escribe un mensaje romántico o pícaro y envíalo a tu contacto más reciente.',
];

function mostrarOpcion(opcion) {
    const resultado = document.getElementById('resultado');
    if (opcion === 'verdad') {
        resultado.textContent = verdades[Math.floor(Math.random() * verdades.length)];
    } else if (opcion === 'reto') {
        resultado.textContent = retos[Math.floor(Math.random() * retos.length)];
    }
}

function mostrarAleatorio() {
    const opciones = ['verdad', 'reto'];
    const opcionAleatoria = opciones[Math.floor(Math.random() * opciones.length)];
    mostrarOpcion(opcionAleatoria);
}
