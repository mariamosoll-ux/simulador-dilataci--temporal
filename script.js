/* =====================================================
   CONSTANTS
===================================================== */

const G = 6.67430e-11;
const c = 299792458;


/* =====================================================
   ELEMENTS
===================================================== */

const massa =
    document.getElementById("massa");

const massaInput =
    document.getElementById("massaInput");

const periode =
    document.getElementById("periode");

const periodeInput =
    document.getElementById("periodeInput");


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


let chartCinematic = null;
let chartGravitacional = null;


/* =====================================================
   NOTACIÓ CIENTÍFICA
===================================================== */

function formatScientific(valor) {

    if (!Number.isFinite(valor)) {
        return "No definit";
    }

    if (valor === 0) {
        return "0";
    }

    const exponent =
        Math.floor(
            Math.log10(
                Math.abs(valor)
            )
        );

    const mantissa =
        valor /
        Math.pow(
            10,
            exponent
        );

    return (
        mantissa.toFixed(3).replace(".", ",") +
        " × 10<sup>" +
        exponent +
        "</sup>"
    );
}


/* =====================================================
   FORMAT DELS TEMPS
===================================================== */

function formatTemps(valor) {

    if (!Number.isFinite(valor)) {
        return "No definit";
    }

    return valor
        .toFixed(6)
        .replace(".", ",");
}


/* =====================================================
   ACTUALITZAR SLIDER MASSA
===================================================== */

massaInput.addEventListener(
    "input",
    () => {

        let valor =
            Number(massaInput.value);

        if (
            valor >= Number(massa.min) &&
            valor <= Number(massa.max)
        ) {

            massa.value =
                valor;

            calcular();
        }

    }
);


/* =====================================================
   ACTUALITZAR INPUT MASSA
===================================================== */

massa.addEventListener(
    "input",
    () => {

        massaInput.value =
            massa.value;

        calcular();

    }
);


/* =====================================================
   INPUT MANUAL MASSA
===================================================== */

massaInput.addEventListener(
    "change",
    () => {

        let valor =
            Number(massaInput.value);

        if (!Number.isFinite(valor) || valor <= 0) {
            return;
        }

        massa.value =
            valor;

        calcular();

    }
);


/* =====================================================
   ACTUALITZAR SLIDER PERÍODE
===================================================== */

periode.addEventListener(
    "input",
    () => {

        periodeInput.value =
            periode.value;

        calcular();

    }
);


/* =====================================================
   INPUT MANUAL PERÍODE
===================================================== */

periodeInput.addEventListener(
    "change",
    () => {

        let valor =
            Number(periodeInput.value);

        if (!Number.isFinite(valor) || valor <= 0) {
            return;
        }

        /*
            El slider només pot arribar fins
            a 10¹² s, però l'input permet
            introduir valors encara més grans.
        */

        if (
            valor >= Number(periode.min) &&
            valor <= Number(periode.max)
        ) {

            periode.value =
                valor;

        }

        calcular();

    }
);


/* =====================================================
   CÀLCUL
===================================================== */

function calcular() {

    const M =
        Number(massaInput.value);

    const T =
        Number(periodeInput.value);


    if (
        !Number.isFinite(M) ||
        !Number.isFinite(T) ||
        M <= 0 ||
        T <= 0
    ) {
        return;
    }


    /* =================================================
       RADI ORBITAL
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
    ================================================= */

    const v =
        Math.sqrt(
            (G * M) / R
        );


    /* =================================================
       DILATACIÓ CINEMÀTICA
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

        tCinematic =
            Infinity;

    }


    /* =================================================
       DILATACIÓ GRAVITACIONAL
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

        tGravitacional =
            Infinity;

    }


    /* =================================================
       RESULTATS
    ================================================= */

    radi.innerHTML =
        formatScientific(R);

    velocitat.innerHTML =
        formatScientific(v);

    tempsCinematic.textContent =
        formatTemps(
            tCinematic
        );

    radiGravitacional.innerHTML =
        formatScientific(R);

    tempsGravitacional.textContent =
        formatTemps(
            tGravitacional
        );

    factorGravitacional.textContent =
        formatTemps(
            tGravitacional
        );


    /* =================================================
       GRÀFIQUES
    ================================================= */

    actualitzarGraficaCinematic(
        tCinematic
    );

    actualitzarGraficaGravitacional(
        tGravitacional
    );
}


/* =====================================================
   GENERAR DADES DE LA GRÀFICA
===================================================== */

function generarDades(factor) {

    if (
        !Number.isFinite(factor) ||
        factor <= 0
    ) {
        return [];
    }


    /*
        Busquem automàticament una escala
        adequada per veure la relació.

        Es generen 50 punts.
    */

    const punts = 50;

    const maxPropi = 10;

    const dades = [];


    for (
        let i = 0;
        i <= punts;
        i++
    ) {

        const tempsPropi =
            (
                i /
                punts
            ) *
            maxPropi;


        const tempsImpropi =
            tempsPropi *
            factor;


        dades.push({

            x:
                tempsPropi,

            y:
                tempsImpropi

        });

    }


    return dades;
}


/* =====================================================
   GRÀFICA CINEMÀTICA
===================================================== */

function actualitzarGraficaCinematic(
    factor
) {

    if (chartCinematic !== null) {

        chartCinematic.destroy();

        chartCinematic = null;
    }


    const canvas =
        document.getElementById(
            "graficaCinematic"
        );


    if (
        !Number.isFinite(factor) ||
        factor <= 0
    ) {
        return;
    }


    const dades =
        generarDades(
            factor
        );


    chartCinematic =
        new Chart(
            canvas,
            {

                type: "line",


                data: {

                    datasets: [

                        {

                            label:
                                "Temps impropi",

                            data:
                                dades,

                            parsing: false,

                            borderWidth: 3,

                            pointRadius: 2,

                            tension: 0

                        }

                    ]

                },


                options: {

                    responsive: true,

                    maintainAspectRatio: false,


                    animation: {

                        duration: 250

                    },


                    plugins: {

                        legend: {

                            labels: {

                                color:
                                    "#cfe2f3"

                            }

                        },

                        title: {

                            display: true,

                            text:
                                "Temps propi i temps impropi",

                            color:
                                "#cfe2f3"

                        }

                    },


                    scales: {

                        x: {

                            type:
                                "linear",

                            title: {

                                display: true,

                                text:
                                    "Temps propi (s)",

                                color:
                                    "#cfe2f3"

                            },

                            ticks: {

                                color:
                                    "#cfe2f3"

                            }

                        },


                        y: {

                            beginAtZero:
                                true,

                            title: {

                                display: true,

                                text:
                                    "Temps impropi (s)",

                                color:
                                    "#cfe2f3"

                            },

                            ticks: {

                                color:
                                    "#cfe2f3"

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
    factor
) {

    if (chartGravitacional !== null) {

        chartGravitacional.destroy();

        chartGravitacional = null;
    }


    const canvas =
        document.getElementById(
            "graficaGravitacional"
        );


    if (
        !Number.isFinite(factor) ||
        factor <= 0
    ) {
        return;
    }


    const dades =
        generarDades(
            factor
        );


    chartGravitacional =
        new Chart(
            canvas,
            {

                type: "line",


                data: {

                    datasets: [

                        {

                            label:
                                "Temps impropi",

                            data:
                                dades,

                            parsing: false,

                            borderWidth: 3,

                            pointRadius: 2,

                            tension: 0

                        }

                    ]

                },


                options: {

                    responsive: true,

                    maintainAspectRatio: false,


                    animation: {

                        duration: 250

                    },


                    plugins: {

                        legend: {

                            labels: {

                                color:
                                    "#cfe2f3"

                            }

                        },

                        title: {

                            display: true,

                            text:
                                "Temps propi i temps impropi",

                            color:
                                "#cfe2f3"

                        }

                    },


                    scales: {

                        x: {

                            type:
                                "linear",

                            title: {

                                display: true,

                                text:
                                    "Temps propi (s)",

                                color:
                                    "#cfe2f3"

                            },

                            ticks: {

                                color:
                                    "#cfe2f3"

                            }

                        },


                        y: {

                            beginAtZero:
                                true,

                            title: {

                                display: true,

                                text:
                                    "Temps impropi (s)",

                                color:
                                    "#cfe2f3"

                            },

                            ticks: {

                                color:
                                    "#cfe2f3"

                            }

                        }

                    }

                }

            }
        );
}


/* =====================================================
   INICI
===================================================== */

massaInput.value =
    massa.value;

periodeInput.value =
    periode.value;

calcular();
