/* =====================================================
   CONSTANTS FÍSIQUES
===================================================== */

const G = 6.67430e-11;

const c = 299792458;



/* =====================================================
   ELEMENTS HTML
===================================================== */

const massa =
    document.getElementById("massa");

const periode =
    document.getElementById("periode");


const massaValor =
    document.getElementById("massaValor");

const periodeValor =
    document.getElementById("periodeValor");


const radi =
    document.getElementById("radi");

const velocitat =
    document.getElementById("velocitat");

const tempsCinematic =
    document.getElementById("tempsCinematic");


const radiGravitacional =
    document.getElementById("radiGravitacional");

const tempsGravitacional =
    document.getElementById("tempsGravitacional");

const factorGravitacional =
    document.getElementById("factorGravitacional");



/* =====================================================
   GRÀFIQUES
===================================================== */

let chartCinematic = null;

let chartGravitacional = null;



/* =====================================================
   FORMAT DELS NÚMEROS
===================================================== */

function formatScientific(valor, decimals = 3) {

    if (!Number.isFinite(valor)) {

        return "—";

    }

    return valor.toExponential(decimals);

}



function formatMassa(valor) {

    const massesSolars =
        valor / 1.989e30;

    return (
        valor.toExponential(3) +
        " kg"
    );

}



function formatPeriode(valor) {

    return valor.toLocaleString(
        "ca-ES"
    ) + " s";

}



/* =====================================================
   CÀLCUL GENERAL
===================================================== */

function calcular() {

    const M =
        Number(massa.value);

    const T =
        Number(periode.value);



    /* =================================================
       RADI ORBITAL

       R = ∛(GMT² / 4π²)
    ================================================= */

    const R =
        Math.cbrt(
            (
                G *
                M *
                T *
                T
            ) /
            (
                4 *
                Math.PI *
                Math.PI
            )
        );



    /* =================================================
       VELOCITAT ORBITAL

       v = √(GM/R)
    ================================================= */

    const v =
        Math.sqrt(
            (G * M) / R
        );



    /* =================================================
       DILATACIÓ CINEMÀTICA

       t = t0 / √(1-v²/c²)

       t0 = 1 s
    ================================================= */

    const termeCinematic =
        1 -
        (
            (v * v) /
            (c * c)
        );


    let tCinematic;


    if (termeCinematic > 0) {

        tCinematic =
            1 /
            Math.sqrt(
                termeCinematic
            );

    } else {

        tCinematic = Infinity;

    }



    /* =================================================
       DILATACIÓ GRAVITACIONAL

       S'utilitza el mateix radi orbital R.

       t = t0 / √(1 - 2GM/Rc²)

       t0 = 1 s
    ================================================= */

    const termeGravitacional =
        1 -
        (
            (2 * G * M) /
            (
                R *
                c *
                c
            )
        );


    let tGravitacional;


    if (termeGravitacional > 0) {

        tGravitacional =
            1 /
            Math.sqrt(
                termeGravitacional
            );

    } else {

        tGravitacional = Infinity;

    }



    /* =================================================
       ACTUALITZAR TEXTOS
    ================================================= */

    massaValor.textContent =
        formatMassa(M);


    periodeValor.textContent =
        formatPeriode(T);


    radi.textContent =
        formatScientific(R);


    velocitat.textContent =
        formatScientific(v);


    tempsCinematic.textContent =
        Number.isFinite(tCinematic)
            ? tCinematic.toFixed(9)
            : "No definit";


    radiGravitacional.textContent =
        formatScientific(R);


    tempsGravitacional.textContent =
        Number.isFinite(tGravitacional)
            ? tGravitacional.toFixed(9)
            : "No definit";


    factorGravitacional.textContent =
        Number.isFinite(tGravitacional)
            ? tGravitacional.toFixed(6)
            : "No definit";



    /* =================================================
       ACTUALITZAR GRÀFIQUES
    ================================================= */

    actualitzarGraficaCinematic(
        M,
        T
    );


    actualitzarGraficaGravitacional(
        M,
        T
    );

}



/* =====================================================
   GRÀFICA CINEMÀTICA
===================================================== */

function actualitzarGraficaCinematic(
    M,
    periodeActual
) {

    const periodes = [];

    const temps = [];



    /*
        La gràfica mostra com varia
        el temps impropi en funció
        del període orbital.

        El període seleccionat queda
        dins de la gràfica.
    */

    const minim =
        Math.max(
            1000,
            periodeActual / 10
        );


    const maxim =
        periodeActual * 10;



    for (
        let i = 0;
        i < 50;
        i++
    ) {

        const T =
            minim *
            Math.pow(
                maxim / minim,
                i / 49
            );


        const R =
            Math.cbrt(
                (
                    G *
                    M *
                    T *
                    T
                ) /
                (
                    4 *
                    Math.PI *
                    Math.PI
                )
            );


        const v =
            Math.sqrt(
                (G * M) / R
            );


        const terme =
            1 -
            (
                (v * v) /
                (c * c)
            );


        const t =
            terme > 0
                ? 1 / Math.sqrt(terme)
                : null;


        periodes.push(T);

        temps.push(t);

    }



    /*
        Buscar el punt corresponent
        al període actual.
    */

    let indexActual = 0;

    let diferenciaMinima =
        Infinity;


    for (
        let i = 0;
        i < periodes.length;
        i++
    ) {

        const diferencia =
            Math.abs(
                periodes[i] -
                periodeActual
            );


        if (
            diferencia <
            diferenciaMinima
        ) {

            diferenciaMinima =
                diferencia;

            indexActual = i;

        }

    }



    /*
        Crear la gràfica.
    */

    if (chartCinematic !== null) {

        chartCinematic.destroy();

    }


    chartCinematic =
        new Chart(
            document.getElementById(
                "graficaCinematic"
            ),
            {

                type: "line",


                data: {

                    labels:
                        periodes.map(
                            valor =>
                                valor.toExponential(1)
                        ),


                    datasets: [

                        {

                            label:
                                "Temps impropi t (s)",

                            data: temps,

                            borderWidth: 2,

                            tension: 0.25,

                            pointRadius:
                                periodes.map(
                                    (_, index) =>
                                        index === indexActual
                                            ? 7
                                            : 2
                                )

                        }

                    ]

                },


                options: {

                    responsive: true,

                    maintainAspectRatio: false,


                    plugins: {

                        legend: {

                            labels: {

                                color: "#cfe2f3"

                            }

                        },


                        title: {

                            display: true,

                            text:
                                "Dilatació temporal cinemàtica",

                            color: "#cfe2f3"

                        }

                    },


                    scales: {

                        x: {

                            ticks: {

                                color: "#cfe2f3"

                            },

                            title: {

                                display: true,

                                text:
                                    "Període orbital T (s)",

                                color: "#cfe2f3"

                            },

                            grid: {

                                color:
                                    "rgba(207,226,243,0.15)"

                            }

                        },


                        y: {

                            ticks: {

                                color: "#cfe2f3"

                            },

                            title: {

                                display: true,

                                text:
                                    "Temps impropi t (s)",

                                color: "#cfe2f3"

                            },

                            grid: {

                                color:
                                    "rgba(207,226,243,0.15)"

                            }

                        }

                    }

                }

            }
        );

}



/* =====================================================
   GRÀFICA GRAVITACIONAL
===================================================== */

function actualitzarGraficaGravitacional(
    M,
    periodeActual
) {

    const periodes = [];

    const temps = [];



    const minim =
        Math.max(
            1000,
            periodeActual / 10
        );


    const maxim =
        periodeActual * 10;



    /*
        Es calcula la dilatació gravitacional
        per diferents períodes.

        El radi es torna a obtenir a partir
        de cada període.
    */

    for (
        let i = 0;
        i < 50;
        i++
    ) {

        const T =
            minim *
            Math.pow(
                maxim / minim,
                i / 49
            );


        const R =
            Math.cbrt(
                (
                    G *
                    M *
                    T *
                    T
                ) /
                (
                    4 *
                    Math.PI *
                    Math.PI
                )
            );


        const terme =
            1 -
            (
                (2 * G * M) /
                (
                    R *
                    c *
                    c
                )
            );


        const t =
            terme > 0
                ? 1 / Math.sqrt(terme)
                : null;


        periodes.push(T);

        temps.push(t);

    }



    /*
        Buscar el punt actual.
    */

    let indexActual = 0;

    let diferenciaMinima =
        Infinity;


    for (
        let i = 0;
        i < periodes.length;
        i++
    ) {

        const diferencia =
            Math.abs(
                periodes[i] -
                periodeActual
            );


        if (
            diferencia <
            diferenciaMinima
        ) {

            diferenciaMinima =
                diferencia;

            indexActual = i;

        }

    }



    /*
        Crear la gràfica.
    */

    if (chartGravitacional !== null) {

        chartGravitacional.destroy();

    }


    chartGravitacional =
        new Chart(
            document.getElementById(
                "graficaGravitacional"
            ),
            {

                type: "line",


                data: {

                    labels:
                        periodes.map(
                            valor =>
                                valor.toExponential(1)
                        ),


                    datasets: [

                        {

                            label:
                                "Temps impropi t (s)",

                            data: temps,

                            borderWidth: 2,

                            tension: 0.25,

                            pointRadius:
                                periodes.map(
                                    (_, index) =>
                                        index === indexActual
                                            ? 7
                                            : 2
                                )

                        }

                    ]

                },


                options: {

                    responsive: true,

                    maintainAspectRatio: false,


                    plugins: {

                        legend: {

                            labels: {

                                color: "#cfe2f3"

                            }

                        },


                        title: {

                            display: true,

                            text:
                                "Dilatació temporal gravitacional",

                            color: "#cfe2f3"

                        }

                    },


                    scales: {

                        x: {

                            ticks: {

                                color: "#cfe2f3"

                            },

                            title: {

                                display: true,

                                text:
                                    "Període orbital T (s)",

                                color: "#cfe2f3"

                            },

                            grid: {

                                color:
                                    "rgba(207,226,243,0.15)"

                            }

                        },


                        y: {

                            ticks: {

                                color: "#cfe2f3"

                            },

                            title: {

                                display: true,

                                text:
                                    "Temps impropi t (s)",

                                color: "#cfe2f3"

                            },

                            grid: {

                                color:
                                    "rgba(207,226,243,0.15)"

                            }

                        }

                    }

                }

            }
        );

}



/* =====================================================
   ACTUALITZACIÓ EN TEMPS REAL
===================================================== */

massa.addEventListener(
    "input",
    calcular
);


periode.addEventListener(
    "input",
    calcular
);



/* =====================================================
   CÀLCUL INICIAL
===================================================== */

calcular();
