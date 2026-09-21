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

function formatEnter(valor) {

    if (!Number.isFinite(valor)) {

        return "—";

    }

    return Math.round(valor).toLocaleString("ca-ES");

}


function formatDecimal(valor, decimals = 3) {

    if (!Number.isFinite(valor)) {

        return "—";

    }

    return valor.toLocaleString(
        "ca-ES",
        {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }
    );

}


function formatMassa(valor) {

    return Math.round(valor).toLocaleString("ca-ES");

}


function formatTemps(valor) {

    if (!Number.isFinite(valor)) {

        return "No definit";

    }

    return valor.toFixed(6);

}



/* =====================================================
   CÀLCUL PRINCIPAL
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

    const factorCinematic =
        1 -
        (
            (v * v) /
            (c * c)
        );


    let tCinematic;


    if (factorCinematic > 0) {

        tCinematic =
            1 /
            Math.sqrt(
                factorCinematic
            );

    } else {

        tCinematic = Infinity;

    }



    /* =================================================
       DILATACIÓ GRAVITACIONAL

       t = t0 / √(1 - 2GM/Rc²)

       t0 = 1 s
    ================================================= */

    const factorGravitacionalCalculat =
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


    if (
        factorGravitacionalCalculat > 0
    ) {

        tGravitacional =
            1 /
            Math.sqrt(
                factorGravitacionalCalculat
            );

    } else {

        tGravitacional = Infinity;

    }



    /* =================================================
       ACTUALITZAR RESULTATS
    ================================================= */

    massaValor.textContent =
        formatMassa(M) + " kg";


    periodeValor.textContent =
        formatEnter(T) + " s";


    radi.textContent =
        formatEnter(R);


    velocitat.textContent =
        formatEnter(v);


    tempsCinematic.textContent =
        formatTemps(tCinematic);


    radiGravitacional.textContent =
        formatEnter(R);


    tempsGravitacional.textContent =
        formatTemps(tGravitacional);


    factorGravitacional.textContent =
        Number.isFinite(tGravitacional)
            ? formatDecimal(
                tGravitacional,
                6
            )
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
=====================================================

   Eix X → temps propi
   Eix Y → temps impropi

   El temps propi es fixa en diferents valors
   i es calcula el temps impropi corresponent.
===================================================== */

function actualitzarGraficaCinematic(
    M,
    Tactual
) {

    const tempsPropi = [];

    const tempsImpropri = [];



    /*
        Calculem la dilatació per al
        període actual.
    */

    const Ractual =
        Math.cbrt(
            (
                G *
                M *
                Tactual *
                Tactual
            ) /
            (
                4 *
                Math.PI *
                Math.PI
            )
        );


    const vactual =
        Math.sqrt(
            (G * M) /
            Ractual
        );


    const factor =
        1 -
        (
            (vactual * vactual) /
            (c * c)
        );


    const factorDilatacio =
        factor > 0
            ? 1 / Math.sqrt(factor)
            : null;



    if (factorDilatacio === null) {

        return;

    }



    /*
        Escala del gràfic:
        0 fins a 10 segons de temps propi.
    */

    for (
        let i = 0;
        i <= 20;
        i++
    ) {

        const propi =
            i * 0.5;

        const impropi =
            propi *
            factorDilatacio;


        tempsPropi.push(propi);

        tempsImpropri.push(impropi);

    }



    /*
        Punt corresponent a 1 segon.
    */

    const indexActual = 2;



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
                        tempsPropi.map(
                            valor =>
                                valor.toLocaleString(
                                    "ca-ES",
                                    {
                                        maximumFractionDigits: 1
                                    }
                                )
                        ),


                    datasets: [

                        {

                            label:
                                "Temps impropi",

                            data:
                                tempsImpropri,

                            borderWidth: 2,

                            tension: 0.15,

                            pointRadius:
                                tempsPropi.map(
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

                        title: {

                            display: true,

                            text:
                                "Relació entre temps propi i temps impropi",

                            color: "#cfe2f3"

                        },


                        legend: {

                            labels: {

                                color: "#cfe2f3"

                            }

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
                                    "Temps propi (s)",

                                color: "#cfe2f3"

                            }

                        },


                        y: {

                            ticks: {

                                color: "#cfe2f3"

                            },

                            title: {

                                display: true,

                                text:
                                    "Temps impropi (s)",

                                color: "#cfe2f3"

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
    Tactual
) {

    const tempsPropi = [];

    const tempsImpropri = [];



    /*
        Radi orbital actual.
    */

    const R =
        Math.cbrt(
            (
                G *
                M *
                Tactual *
                Tactual
            ) /
            (
                4 *
                Math.PI *
                Math.PI
            )
        );



    /*
        Factor gravitacional.

        t = t0 / √(1 - 2GM/Rc²)
    */

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


    const factorDilatacio =
        terme > 0
            ? 1 / Math.sqrt(terme)
            : null;



    if (factorDilatacio === null) {

        return;

    }



    /*
        Eix X:
        temps propi

        Eix Y:
        temps impropi
    */

    for (
        let i = 0;
        i <= 20;
        i++
    ) {

        const propi =
            i * 0.5;

        const impropi =
            propi *
            factorDilatacio;


        tempsPropi.push(propi);

        tempsImpropri.push(impropi);

    }



    const indexActual = 2;



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
                        tempsPropi.map(
                            valor =>
                                valor.toLocaleString(
                                    "ca-ES",
                                    {
                                        maximumFractionDigits: 1
                                    }
                                )
                        ),


                    datasets: [

                        {

                            label:
                                "Temps impropi",

                            data:
                                tempsImpropri,

                            borderWidth: 2,

                            tension: 0.15,

                            pointRadius:
                                tempsPropi.map(
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

                        title: {

                            display: true,

                            text:
                                "Relació entre temps propi i temps impropi",

                            color: "#cfe2f3"

                        },


                        legend: {

                            labels: {

                                color: "#cfe2f3"

                            }

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
                                    "Temps propi (s)",

                                color: "#cfe2f3"

                            }

                        },


                        y: {

                            ticks: {

                                color: "#cfe2f3"

                            },

                            title: {

                                display: true,

                                text:
                                    "Temps impropi (s)",

                                color: "#cfe2f3"

                            }

                        }

                    }

                }

            }
        );

}



/* =====================================================
   ACTUALITZACIÓ AUTOMÀTICA
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
   INICIALITZACIÓ
===================================================== */

calcular();
