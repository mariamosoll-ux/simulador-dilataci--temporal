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
   NOTACIÓ CIENTÍFICA
   Exemple:
   3.4e38 → 3,40 × 10^38
===================================================== */

function formatScientific(valor, decimals = 3) {

    if (!Number.isFinite(valor)) {

        return "—";

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


    const mantissaText =
        mantissa.toLocaleString(
            "ca-ES",
            {
                minimumFractionDigits: decimals - 1,
                maximumFractionDigits: decimals - 1
            }
        );


    return (
        mantissaText +
        " × 10<sup>" +
        exponent +
        "</sup>"
    );
}



/* =====================================================
   FORMAT PER AL PERÍODE
===================================================== */

function formatNormal(valor) {

    return valor.toLocaleString(
        "ca-ES"
    );
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
       ACTUALITZAR PARÀMETRES
    ================================================= */

    massaValor.innerHTML =
        formatScientific(M, 3) +
        " kg";


    periodeValor.textContent =
        formatNormal(T) +
        " s";



    /* =================================================
       ACTUALITZAR RESULTATS
    ================================================= */

    radi.innerHTML =
        formatScientific(R, 3);


    velocitat.innerHTML =
        formatScientific(v, 3);


    tempsCinematic.textContent =
        Number.isFinite(tCinematic)
            ? tCinematic.toFixed(6)
            : "No definit";


    radiGravitacional.innerHTML =
        formatScientific(R, 3);


    tempsGravitacional.textContent =
        Number.isFinite(tGravitacional)
            ? tGravitacional.toFixed(6)
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
    Tactual
) {

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


    if (terme <= 0) {

        return;

    }


    const factor =
        1 /
        Math.sqrt(terme);


    const tempsPropi = [];

    const tempsImpropi = [];


    for (
        let i = 0;
        i <= 20;
        i++
    ) {

        const propi =
            i * 0.5;


        const impropi =
            propi * factor;


        tempsPropi.push(propi);

        tempsImpropi.push(impropi);

    }


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

                    labels: tempsPropi,

                    datasets: [

                        {

                            label:
                                "Temps impropi",

                            data:
                                tempsImpropi,

                            borderWidth: 2,

                            tension: 0.1,

                            pointRadius: 2

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


    if (terme <= 0) {

        return;

    }


    const factor =
        1 /
        Math.sqrt(terme);


    const tempsPropi = [];

    const tempsImpropi = [];


    for (
        let i = 0;
        i <= 20;
        i++
    ) {

        const propi =
            i * 0.5;


        const impropi =
            propi * factor;


        tempsPropi.push(propi);

        tempsImpropi.push(impropi);

    }


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

                    labels: tempsPropi,

                    datasets: [

                        {

                            label:
                                "Temps impropi",

                            data:
                                tempsImpropi,

                            borderWidth: 2,

                            tension: 0.1,

                            pointRadius: 2

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
