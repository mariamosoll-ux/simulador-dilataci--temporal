/* =====================================================
   CONSTANTS FÍSIQUES
===================================================== */

const G = 6.67430e-11;
const c = 299792458;


/* =====================================================
   ELEMENTS HTML
===================================================== */

const massa = document.getElementById("massa");
const periode = document.getElementById("periode");

const massaValor = document.getElementById("massaValor");
const periodeValor = document.getElementById("periodeValor");

const radi = document.getElementById("radi");
const velocitat = document.getElementById("velocitat");
const tempsCinematic = document.getElementById("tempsCinematic");

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
   3.4e38 → 3,40 × 10³⁸
===================================================== */

function formatScientific(valor, decimals = 3) {

    if (!Number.isFinite(valor)) {
        return "—";
    }

    if (valor === 0) {
        return "0";
    }

    const exponent =
        Math.floor(Math.log10(Math.abs(valor)));

    const mantissa =
        valor / Math.pow(10, exponent);

    const mantissaText =
        mantissa.toLocaleString("ca-ES", {
            minimumFractionDigits: decimals - 1,
            maximumFractionDigits: decimals - 1
        });

    return (
        mantissaText +
        " × 10<sup>" +
        exponent +
        "</sup>"
    );
}


/* =====================================================
   TEMPS
===================================================== */

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

    const M = Number(massa.value);
    const T = Number(periode.value);


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
       DILATACIÓ TEMPORAL CINEMÀTICA

       t = t₀ / √(1 - v²/c²)

       t₀ = 1 s
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
            Math.sqrt(termeCinematic);

    } else {

        tCinematic = Infinity;

    }


    /* =================================================
       DILATACIÓ TEMPORAL GRAVITACIONAL

       t = t₀ / √(1 - 2GM/Rc²)

       t₀ = 1 s
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
            Math.sqrt(termeGravitacional);

    } else {

        tGravitacional = Infinity;

    }


    /* =================================================
       MOSTRAR PARÀMETRES
    ================================================= */

    massaValor.innerHTML =
        formatScientific(M, 3) + " kg";

    periodeValor.innerHTML =
        formatScientific(T, 3) + " s";


    /* =================================================
       MOSTRAR RESULTATS
    ================================================= */

    radi.innerHTML =
        formatScientific(R, 3);

    velocitat.innerHTML =
        formatScientific(v, 3);

    tempsCinematic.textContent =
        formatTemps(tCinematic);

    radiGravitacional.innerHTML =
        formatScientific(R, 3);

    tempsGravitacional.textContent =
        formatTemps(tGravitacional);

    factorGravitacional.textContent =
        Number.isFinite(tGravitacional)
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

   EIX X → TEMPS PROPI
   EIX Y → TEMPS IMPROPI

   Si:
   t₀ = 1 s
   t  = 7 s

   llavors:

   1 s → 7 s
   2 s → 14 s
   3 s → 21 s
   ...
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
        Es generen 21 punts.
        El temps propi va de 0 a 20 s.
    */

    for (let i = 0; i <= 20; i++) {

        const propi = i;

        const impropi =
            propi * factor;

        tempsPropi.push(propi);
        tempsImpropi.push(impropi);
    }


    /*
        Si ja existeix una gràfica,
        s'elimina abans de crear-ne una nova.
    */

    if (chartCinematic !== null) {
        chartCinematic.destroy();
    }


    const ctx =
        document.getElementById(
            "graficaCinematic"
        );


    chartCinematic =
        new Chart(ctx, {

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
                                    y: tempsImpropi[i]
                                })
                            ),

                        borderWidth: 2,

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

                        color: "#cfe2f3",

                        font: {
                            size: 15
                        }

                    },

                    legend: {

                        labels: {

                            color: "#cfe2f3"

                        }

                    }

                },


                scales: {

                    x: {

                        type: "linear",

                        min: 0,

                        title: {

                            display: true,

                            text:
                                "Temps propi (s)",

                            color: "#cfe2f3"

                        },

                        ticks: {

                            color: "#cfe2f3"

                        }

                    },


                    y: {

                        beginAtZero: true,

                        title: {

                            display: true,

                            text:
                                "Temps impropi (s)",

                            color: "#cfe2f3"

                        },

                        ticks: {

                            color: "#cfe2f3"

                        }

                    }

                }

            }

        });
}


/* =====================================================
   GRÀFICA GRAVITACIONAL

   EIX X → TEMPS PROPI
   EIX Y → TEMPS IMPROPI
===================================================== */

function actualitzarGraficaGravitacional(
    factor
) {

    if (!Number.isFinite(factor)) {
        return;
    }


    const tempsPropi = [];
    const tempsImpropi = [];


    for (let i = 0; i <= 20; i++) {

        const propi = i;

        const impropi =
            propi * factor;

        tempsPropi.push(propi);
        tempsImpropi.push(impropi);
    }


    if (chartGravitacional !== null) {
        chartGravitacional.destroy();
    }


    const ctx =
        document.getElementById(
            "graficaGravitacional"
        );


    chartGravitacional =
        new Chart(ctx, {

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
                                    y: tempsImpropi[i]
                                })
                            ),

                        borderWidth: 2,

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

                        color: "#cfe2f3",

                        font: {
                            size: 15
                        }

                    },

                    legend: {

                        labels: {

                            color: "#cfe2f3"

                        }

                    }

                },


                scales: {

                    x: {

                        type: "linear",

                        min: 0,

                        title: {

                            display: true,

                            text:
                                "Temps propi (s)",

                            color: "#cfe2f3"

                        },

                        ticks: {

                            color: "#cfe2f3"

                        }

                    },


                    y: {

                        beginAtZero: true,

                        title: {

                            display: true,

                            text:
                                "Temps impropi (s)",

                            color: "#cfe2f3"

                        },

                        ticks: {

                            color: "#cfe2f3"

                        }

                    }

                }

            }

        });
}


/* =====================================================
   ACTUALITZACIÓ AUTOMÀTICA

   Les dues gràfiques i tots els resultats
   es recalculen en modificar qualsevol paràmetre.
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
