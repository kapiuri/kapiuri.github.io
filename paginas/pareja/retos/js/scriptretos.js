const retos = [
    { nombre: '1.Los besos ciegos', descripcion: 'Este juego consiste en aplicar un poco de misterio. Un miembro de la pareja debe de vendarse los ojos y dar varias vueltas alrededor de sí mismo. Mientras, el otro debe ir nombrando varias partes del cuerpo y la persona con los ojos tapados tendrá que besar la zona mencionada sin utilizar las manos para ubicarse. Acertar puede ser muy difícil.' },
    { nombre: '2.La bomba', descripcion: 'Para realizarlo, solamente hay que coger un reloj y decidir un intervalo de tiempo en el que no está permitido la penetración. Por ejemplo, 10 minutos en los que podréis daros besos, caricias, masajes… todo menos la penetración.' },
    { nombre: '3.Body Painting', descripcion: 'Para comenzar, hay que crear una atmósfera; encender algunas velas, perfumar la habitación... Al contrario de lo que se pueda pensar, esta actividad se debe comenzar ya sin ropa, e ir pintando el cuerpo de tu pareja como si de un lienzo se tratara.' },
    { nombre: '4.El prisionero', descripcion: 'Un clásico del sexo BDSM en el que la persona que hace de prisionero queda inmovilizado al atarlo, por ejemplo, en una silla. Además, prueba a taparle los ojos para que sea más erótica la experiencia.' },
    { nombre: '5.La ruleta', descripcion: 'Vete a la ruleta y haz la postura que te mande durante 5 minutos' },
    { nombre: '6.Papelitos sexuales', descripcion: 'Se necesitan dos tarros o dos envases, uno en el que se pongan las partes del cuerpo y en los otros diferentes verbos. La persona cogerá un papel de cada tarro y tendrá que hacer la acción que le haya tocado. Cuanto mayor sea la creatividad e imaginación, más divertido será. Como todo en la vida.' },
    { nombre: '7.Strip poker', descripcion: 'Este juego de mesa puede ser muy divertido a la par que excitante. Consiste en jugar al poker y, quien pierde, debe quitarse una prenda cada vez que pierda. También se puede probar con otros juegos de cartas.' },
    { nombre: '8.La caja misteriosa', descripcion: 'Para empezar, permitirá conocer mejor a tu pareja, y las locuras pasionales que le gustaría vivir. Es una variante de la anterior, pero en este caso, cada uno escribirá diferentes fantasías en un papel, las introducirán en una caja o recipiente. Después, uno de los dos sacará uno de los deseos y si ambos están de acuerdo, lo podrán poner en práctica. El juego termina cuando no quede ninguna experiencia por cumplir… Así que puede que no acabe jamás.' },
    { nombre: '9.Disfraces', descripcion: 'Mantener relaciones sexuales simulando ser otra persona es muy estimulante.' },
    { nombre: '10.Masaje con aceite', descripcion: 'Tan fácil como que uno de los dos se coloque tumbado bocabajo mientras el otro le dé un masaje sensual con un aceite lubricante (El aceite de freir las patatas no vale. Gitano).' },
    { nombre: '11.Pintar, sí, pero con la cadera', descripcion: 'Esta práctica sexual consiste en sacar tu yo más dominante. Y es que, parece ser que, deletrear una palabra con las caderas facilita llegar al orgasmo.' },
    { nombre: '12.La botella sensual', descripcion: 'Si alguna vez has jugado a la botella tradicional, esta variación no te resultará nada complicada. Pensado para que parejas de todo tipo disfruten al máximo de sus encuentros íntimos.' },
    { nombre: '13.Fuerte sexual', descripcion: 'Como los que todos hacían cuando eran niños, intentando que el espacio sea lo más cómodo e íntimo posible. La idea es que tengas un nuevo espacio para tener sexo y experimentar con posiciones.' },
    { nombre: '14.Búsqueda del tesoro', descripcion: 'Típico juego infantil en el que vas siguiendo pistas hasta encontrar el tesoro, la diferencia es que cada pista debe llevarte a un reto sexual o a un accesorio que puedan usar durante el sexo.' },
    { nombre: '15.Hoy, las cartas las pones tú', descripcion: 'Coge una baraja de cartas y elige una al azar. El número marcará la duración del juego sexual que toque realizar (en la baraja española del 1 al 7), la figura los minutos con plena intensidad y entrega y el palo la práctica propiamente dicha. Con una baraja de cartas, el número que salga (en la baraja española del 1 al 7) marca la duración de la actividad sexual que toque realizar, la figura los minutos con plena intensidad y los palos la práctica que se debe realizar: Sota: un minuto a máxima velocidad y potencia. Caballo: dos minutos a máxima velocidad y potencia. Rey: tres minutos a máxima velocidad y potencia. Copas: sexo oral. Espadas: penetración. Bastos: eliges práctica, ya sea alguna de las anteriores o una diferente como besos o caricias, pero eso sí, ¡sin usar las manos! Oros: Tienes que probar algo que no hayas hecho nunca. En este caso te proponemos probar una postura que no hayas utilizado antes.' },
    { nombre: '16.Sex Fortunes Card Game', descripcion: 'Este juego de cartas del Tarot se actualiza con 78 cartas de la fortuna sexual que tú y tu pareja podéis representar y disfrutar juntos. Es un gran juego para cualquier pareja que quiera ser más aventurera en el dormitorio y aprender más sobre los deseos sexuales del otro. Vete a las cartas del tarot para jugar (o usa las tuyas si tienes tiempo)' },
    { nombre: '17.Strip or Tease Card Game', descripcion: 'Diviértete interpretando y representando escenarios sexuales a través de un juego de striptease o tease. Crea el ambiente y dominr el arte del striptease para atraer a tu pareja.' }
];

function cargarListaRetos() {
    const lista = document.getElementById('lista-retos');
    retos.forEach((reto, index) => {
        const li = document.createElement('li');
        li.className = 'reto';
        li.textContent = reto.nombre;
        li.dataset.index = index;
        li.onclick = () => mostrarInformacion(index);
        lista.appendChild(li);
    });
}

function seleccionarAleatorio() {
    const index = Math.floor(Math.random() * retos.length);
    mostrarInformacion(index);
}

function mostrarInformacion(index) {
    const info = document.getElementById('informacion');
    info.innerHTML = `<h2>${retos[index].nombre}</h2><p>${retos[index].descripcion}</p>`;
}

cargarListaRetos();
