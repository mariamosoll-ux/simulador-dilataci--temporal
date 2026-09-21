/* =====================================================
   CONSTANTS FÍSIQUES
===================================================== */

const G = 6.67430e-11;

const c = 299792458;


/* =====================================================
   CONVERSIÓ D'HORES A SEGONS
===================================================== */

const HORA = 3600;


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
===================================================== */

function formatScientific(valor, decimals = 3) {

    if (!Number.isFinite(valor)) {
        return "—";
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
   CÀLCUL PRINCIPAL
===================================================== */

function calcular() {

    const M =
        Number(massa.value);


    /*
        El valor del slider està en hores.

        Per als càlculs físics es transforma
        a segons.
    */

    const T_h =
        Number(periode.value);

    const T =
        T_h * HORA;



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

       t = t₀ / √(1-v²/c²)
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

       t = t₀ / √(1 - 2GM/Rc²)
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
       MOSTRAR PARÀMETRES
    ================================================= */

    massaValor.innerHTML =
        formatScientific(
            M,
            3
        ) +
        " kg";


    /*
        Ara el període també es mostra
        en notació científica i en hores.
    */

    periodeValor.innerHTML =
        formatScientific(
            T_h,
            3
        ) +
        " h";



    /* =================================================
       MOSTRAR RESULTATS
    ================================================= */

    radi.innerHTML =
        formatScientific(
            R,
            3
        );


    velocitat.innerHTML =
        formatScientific(
            v,
            3
        );


    tempsCinematic.textContent =
        Number.isFinite(
            tCinematic
        )
            ? tCinematic.toFixed(6)
            : "No definit";


    radiGravitacional.innerHTML =
        formatScientific(
            R,
            3
        );


    tempsGravitacional.textContent =
        Number.isFinite(
            tGravitacional
        )
            ? tGravitacional.toFixed(6)
            : "No definit";


    factorGravitacional.textContent =
        Number.isFinite(
            tGravitacional
        )
            ? tGravitacional.toFixed(6)
            : "No definit";



    /* =================================================
       ACTUALITZAR GRÀFIQUES
    ================================================= */

    actualitzarGraficaCinematic(
        tCinematic
    );


    actualitzarGraficaGravitacional(
        tGravitacional
    );

}



/* =====================================================
   GRÀFICA CINEMÀTICA
===================================================== */

function actualitzarGraficaCinematic(
    factor
) {

    if (!Number.isFinite(factor)) {
        return;
    }


    const tempsPropi = [];

    const tempsImpropi = [];


    /*
        Ara el gràfic utilitza hores.

        Es mostren 0–24 hores de temps propi.
        Això permet apreciar millor les diferències.
    */

    for (
        let i = 0;
        i <= 24;
        i++
    ) {

        const propi =
            i;

        const impropi =
            propi *
            factor;


        tempsPropi.push(
            propi
        );

        tempsImpropi.push(
            impropi
        );

    }


    if (chartCinematic !== null) {

        chartCinematic.destroy();

    }


    const ctx =
        document.getElementById(
            "graficaCinematic"
        );


    chartCinematic =
        new Chart(
            ctx,
            {

                type: "line",


                data: {

                    datasets: [

                        {

                            label:
                                "Temps impropi",

                            data:
                                tempsPropi.map(
                                    (x, i) => ({
                                        x: x,
                                        y:
                                            tempsImpropi[i]
                                    })
                                ),

                            borderWidth: 3,

                            tension: 0.1,

                            pointRadius: 3,

                            fill: false

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

                            color:
                                "#cfe2f3",

                            font: {
                                size: 15
                            }

                        },


                        legend: {

                            labels: {

                                color:
                                    "#cfe2f3"

                            }

                        }

                    },


                    scales: {

                        x: {

                            type:
                                "linear",

                            min:
                                0,

                            max:
                                24,


                            title: {

                                display: true,

                                text:
                                    "Temps propi (h)",

                                color:
                                    "#cfe2f3"

                            },


                            ticks: {

                                color:
                                    "#cfe2f3",

                                stepSize:
                                    4

                            }

                        },


                        y: {

                            beginAtZero:
                                true,


                            title: {

                                display: true,

                                text:
                                    "Temps impropi (h)",

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

    if (!Number.isFinite(factor)) {
        return;
    }


    const tempsPropi = [];

    const tempsImpropi = [];


    /*
        0–24 hores de temps propi.
    */

    for (
        let i = 0;
        i <= 24;
        i++
    ) {

        const propi =
            i;

        const impropi =
            propi *
            factor;


        tempsPropi.push(
            propi
        );

        tempsImpropi.push(
            impropi
        );

    }


    if (chartGravitacional !== null) {

        chartGravitacional.destroy();

    }


    const ctx =
        document.getElementById(
            "graficaGravitacional"
        );


    chartGravitacional =
        new Chart(
            ctx,
            {

                type: "line",


                data: {

                    datasets: [

                        {

                            label:
                                "Temps impropi",

                            data:
                                tempsPropi.map(
                                    (x, i) => ({
                                        x: x,
                                        y:
                                            tempsImpropri[i]
                                    })
                                ),

                            borderWidth: 3,

                            tension: 0.1,

                            pointRadius: 3,

                            fill: false

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

                            color:
                                "#cfe2f3",

                            font: {
                                size: 15
                            }

                        },


                        legend: {

                            labels: {

                                color:
                                    "#cfe2f3"

                            }

                        }

                    },


                    scales: {

                        x: {

                            type:
                                "linear",

                            min:
                                0,

                            max:
                                24,


                            title: {

                                display: true,

                                text:
                                    "Temps propi (h)",

                                color:
                                    "#cfe2f3"

                            },


                            ticks: {

                                color:
                                    "#cfe2f3",

                                stepSize:
                                    4

                            }

                        },


                        y: {

                            beginAtZero:
                                true,


                            title: {

                                display: true,

                                text:
                                    "Temps impropi (h)",

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
