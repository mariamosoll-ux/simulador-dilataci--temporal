const G = 6.67430e-11;

const c = 299792458;


/* CONTROLS */

const massaMantissa =
    document.getElementById("massaMantissa");

const massaExponent =
    document.getElementById("massaExponent");

const periodeMantissa =
    document.getElementById("periodeMantissa");

const periodeExponent =
    document.getElementById("periodeExponent");


const massaValor =
    document.getElementById("massaValor");

const periodeValor =
    document.getElementById("periodeValor");


/* RESULTATS */

const radi =
    document.getElementById("radi");

const velocitat =
    document.getElementById("velocitat");

const tempsCinematic =
    document.getElementById("tempsCinematic");

const factorCinematic =
    document.getElementById("factorCinematic");


const radiGravitacional =
    document.getElementById("radiGravitacional");

const tempsGravitacional =
    document.getElementById("tempsGravitacional");

const factorGravitacional =
    document.getElementById("factorGravitacional");


let chartCinematic = null;

let chartGravitacional = null;


/* =====================================================
   FORMAT CIENTÍFIC
===================================================== */

function formatScientific(valor, decimals = 3) {

    if (!Number.isFinite(valor)) {
        return "No definit";
    }

    if (valor === 0) {
        return "0";
    }

    const exponent =
        Math.floor(
            Math.log10(Math.abs(valor))
        );

    const mantissa =
        valor /
        Math.pow(10, exponent);

    return (
        mantissa
            .toFixed(decimals)
            .replace(".", ",")
        +
        " × 10"
        +
        "<sup>"
        +
        exponent
        +
        "</sup>"
    );
}


/* =====================================================
   FORMAT NORMAL PER A LES GRÀFIQUES
===================================================== */

function formatNormal(valor) {

    if (!Number.isFinite(valor)) {
        return "";
    }

    if (valor === 0) {
        return "0";
    }

    return new Intl.NumberFormat(
        "ca-ES",
        {
            useGrouping: true,
            maximumFractionDigits: 6
        }
    ).format(valor);
}


/* =====================================================
   OBTENIR MASSA
===================================================== */

function obtenirMassa() {

    const mantissa =
        Number(massaMantissa.value);

    const exponent =
        Number(massaExponent.value);


    if (
        !Number.isFinite(mantissa) ||
        !Number.isFinite(exponent) ||
        mantissa <= 0
    ) {
        return NaN;
    }


    return (
        mantissa *
        Math.pow(10, exponent)
    );
}


/* =====================================================
   OBTENIR PERÍODE
===================================================== */

function obtenirPeriode() {

    const mantissa =
        Number(periodeMantissa.value);

    const exponent =
        Number(periodeExponent.value);


    if (
        !Number.isFinite(mantissa) ||
        !Number.isFinite(exponent) ||
        mantissa <= 0
    ) {
        return NaN;
    }


    return (
        mantissa *
        Math.pow(10, exponent)
    );
}


/* =====================================================
   ACTUALITZAR VALORS DELS CONTROLS
===================================================== */

function actualitzarControls() {

    const M =
        obtenirMassa();

    const T =
        obtenirPeriode();


    massaValor.innerHTML =
        formatScientific(M) + " kg";


    periodeValor.innerHTML =
        formatScientific(T) + " s";
}


/* =====================================================
   CÀLCUL DEL SIMULADOR
===================================================== */

function calcular() {

    actualitzarControls();


    const M =
        obtenirMassa();

    const T =
        obtenirPeriode();


    if (
        !Number.isFinite(M) ||
        !Number.isFinite(T) ||
        M <= 0 ||
        T <= 0
    ) {
        return;
    }


    /* =================================================
       1. RADI ORBITAL

       R = ∛(G M T² / 4π²)
    ================================================= */

    const radiOrbital =
        Math.cbrt(
            (
                G *
                M *
                Math.pow(T, 2)
            )
            /
            (
                4 *
                Math.pow(Math.PI, 2)
            )
        );


    /* =================================================
       2. VELOCITAT ORBITAL

       v = √(GM/R)
    ================================================= */

    const velocitatOrbital =
        Math.sqrt(
            (
                G *
                M
            )
            /
            radiOrbital
        );


    /* =================================================
       3. DILATACIÓ TEMPORAL CINEMÀTICA

       t = t0 / √(1 - v²/c²)

       t0 = 1 s
    ================================================= */

    const tempsPropi = 1;


    const termeCinematic =
        1 -
        (
            Math.pow(
                velocitatOrbital,
                2
            )
            /
            Math.pow(c, 2)
        );


    let tempsImpropiCinematic;


    if (termeCinematic > 0) {

        tempsImpropiCinematic =
            tempsPropi /
            Math.sqrt(
                termeCinematic
            );

    } else {

        tempsImpropiCinematic =
            Infinity;

    }


    /* =================================================
       4. DILATACIÓ TEMPORAL GRAVITACIONAL

       tf = t0 / √(1 - 2GM/Rc²)

       t0 = 1 s
    ================================================= */

    const termeGravitacional =
        1 -
        (
            2 *
            G *
            M
        )
        /
        (
            radiOrbital *
            Math.pow(c, 2)
        );


    let tempsImpropiGravitacional;


    if (termeGravitacional > 0) {

        tempsImpropiGravitacional =
            tempsPropi /
            Math.sqrt(
                termeGravitacional
            );

    } else {

        tempsImpropiGravitacional =
            Infinity;

    }


    /* =================================================
       FACTORS DE DILATACIÓ
    ================================================= */

    const factorCinematicValor =
        tempsImpropiCinematic /
        tempsPropi;


    const factorGravitacionalValor =
        tempsImpropiGravitacional /
        tempsPropi;


    /* =================================================
       MOSTRAR RESULTATS
    ================================================= */

    radi.innerHTML =
        formatScientific(
            radiOrbital
        );


    velocitat.innerHTML =
        formatScientific(
            velocitatOrbital
        );


    tempsCinematic.innerHTML =
        formatScientific(
            tempsImpropiCinematic
        );


    factorCinematic.innerHTML =
        formatScientific(
            factorCinematicValor
        );


    radiGravitacional.innerHTML =
        formatScientific(
            radiOrbital
        );


    tempsGravitacional.innerHTML =
        formatScientific(
            tempsImpropiGravitacional
        );


    factorGravitacional.innerHTML =
        formatScientific(
            factorGravitacionalValor
        );


    /* =================================================
       ACTUALITZAR GRÀFIQUES
    ================================================= */

    chartCinematic =
        actualitzarGrafica(
            "graficaCinematic",
            factorCinematicValor,
            "Temps propi i temps impropi — efecte cinemàtic",
            chartCinematic
        );


    chartGravitacional =
        actualitzarGrafica(
            "graficaGravitacional",
            factorGravitacionalValor,
            "Temps propi i temps impropi — efecte gravitacional",
            chartGravitacional
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


    const dades = [];


    for (
        let i = 0;
        i <= 100;
        i++
    ) {

        const tempsPropi =
            i / 10;


        const tempsImpropi =
            tempsPropi *
            factor;


        dades.push({

            x: tempsPropi,

            y: tempsImpropi

        });

    }


    return dades;
}


/* =====================================================
   ACTUALITZAR GRÀFICA
===================================================== */

function actualitzarGrafica(
    id,
    factor,
    titol,
    graficaAnterior
) {

    if (graficaAnterior !== null) {

        graficaAnterior.destroy();

    }


    if (
        !Number.isFinite(factor) ||
        factor <= 0
    ) {

        return null;

    }


    const canvas =
        document.getElementById(id);


    const dades =
        generarDades(factor);


    const novaGrafica =
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

                            parsing:
                                false,

                            borderWidth:
                                3,

                            pointRadius:
                                3,

                            pointHoverRadius:
                                8,

                            tension:
                                0

                        }

                    ]

                },


                options: {

                    responsive:
                        true,

                    maintainAspectRatio:
                        false,


                    interaction: {

                        mode:
                            "nearest",

                        intersect:
                            false

                    },


                    plugins: {

                        title: {

                            display:
                                true,

                            text:
                                titol,

                            color:
                                "#cfe2f3"

                        },


                        legend: {

                            labels: {

                                color:
                                    "#cfe2f3"

                            }

                        },


                        tooltip: {

                            displayColors:
                                false,


                            callbacks: {

                                title:
                                    function() {

                                        return "Equivalència temporal";

                                    },


                                label:
                                    function(context) {

                                        const x =
                                            context.parsed.x;

                                        const y =
                                            context.parsed.y;


                                        return [

                                            "Temps propi: "
                                            +
                                            formatNormal(x)
                                            +
                                            " s",

                                            "Temps impropi: "
                                            +
                                            formatNormal(y)
                                            +
                                            " s"

                                        ];

                                    }

                            }

                        }

                    },


                    scales: {

                        x: {

                            type:
                                "linear",

                            beginAtZero:
                                true,


                            title: {

                                display:
                                    true,

                                text:
                                    "Temps propi (s)",

                                color:
                                    "#cfe2f3"

                            },


                            ticks: {

                                color:
                                    "#cfe2f3",

                                callback:
                                    function(value) {

                                        return formatNormal(
                                            Number(value)
                                        );

                                    }

                            }

                        },


                        y: {

                            beginAtZero:
                                true,


                            title: {

                                display:
                                    true,

                                text:
                                    "Temps impropi (s)",

                                color:
                                    "#cfe2f3"

                            },


                            ticks: {

                                color:
                                    "#cfe2f3",

                                callback:
                                    function(value) {

                                        return formatNormal(
                                            Number(value)
                                        );

                                    }

                            }

                        }

                    }

                }

            }
        );


    return novaGrafica;
}


/* =====================================================
   ACTUALITZACIÓ DELS RESULTATS
===================================================== */

massaMantissa.addEventListener(
    "input",
    calcular
);


massaExponent.addEventListener(
    "input",
    calcular
);


periodeMantissa.addEventListener(
    "input",
    calcular
);


periodeExponent.addEventListener(
    "input",
    calcular
);


/* =====================================================
   INICIAR EL SIMULADOR
===================================================== */

calcular();
