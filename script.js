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
        mantissa
            .toFixed(3)
            .replace(".", ",") +
        " × 10<sup>" +
        exponent +
        "</sup>"
    );
}


/* =====================================================
   FORMAT DEL TEMPS
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
   CONVERTIR EN NÚMERO
   Accepta:

   3.4e38
   3,4e38
   340000000000000000000
===================================================== */

function convertirNumero(text) {

    if (typeof text !== "string") {
        return Number(text);
    }

    return Number(
        text
            .trim()
            .replace(",", ".")
    );
}


/* =====================================================
   MASSA — SLIDER
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
   MASSA — INPUT MANUAL
===================================================== */

massaInput.addEventListener(
    "input",
    () => {

        const valor =
            convertirNumero(
                massaInput.value
            );


        if (
            Number.isFinite(valor) &&
            valor > 0
        ) {

            /*
                El slider només representa
                fins a 10^42 kg.

                L'input manual pot superar
                aquest valor.
            */

            if (
                valor >=
                Number(massa.min) &&
                valor <=
                Number(massa.max)
            ) {

                massa.value =
                    valor;

            }

            calcular();

        }

    }
);


/* =====================================================
   PERÍODE — SLIDER
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
   PERÍODE — INPUT MANUAL
===================================================== */

periodeInput.addEventListener(
    "input",
    () => {

        const valor =
            convertirNumero(
                periodeInput.value
            );


        /*
            El període mai pot ser
            negatiu ni igual a zero.
        */

        if (
            Number.isFinite(valor) &&
            valor > 0
        ) {

            /*
                Si està dins del rang
                del slider, també
                actualitzem el slider.
            */

            if (
                valor >=
                Number(periode.min) &&
                valor <=
                Number(periode.max)
            ) {

                periode.value =
                    valor;

            }

            calcular();

        }

    }
);


/* =====================================================
   CÀLCUL PRINCIPAL
===================================================== */

function calcular() {

    const M =
        convertirNumero(
            massaInput.value
        );

    const T =
        convertirNumero(
            periodeInput.value
        );


    /*
        Evita valors no vàlids.
    */

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
       FACTOR CINEMÀTIC

       γ = 1 / √(1-v²/c²)
    ================================================= */

    const termeCinematic =
        1 -
        (
            (v * v) /
            (c * c)
        );


    let factorCinematicValor;


    if (
        termeCinematic > 0
    ) {

        factorCinematicValor =
            1 /
            Math.sqrt(
                termeCinematic
            );

    } else {

        factorCinematicValor =
            Infinity;

    }


    /* =================================================
       FACTOR GRAVITACIONAL

       γ = 1 / √(1-2GM/Rc²)
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


    let factorGravitacionalValor;


    if (
        termeGravitacional > 0
    ) {

        factorGravitacionalValor =
            1 /
            Math.sqrt(
                termeGravitacional
            );

    } else {

        factorGravitacionalValor =
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
            factorCinematicValor
        );


    factorCinematic.textContent =
        formatTemps(
            factorCinematicValor
        );


    radiGravitacional.innerHTML =
        formatScientific(R);


    tempsGravitacional.textContent =
        formatTemps(
            factorGravitacionalValor
        );


    factorGravitacional.textContent =
        formatTemps(
            factorGravitacionalValor
        );


    /* =================================================
       GRÀFIQUES
    ================================================= */

    actualitzarGrafica(
        "graficaCinematic",
        factorCinematicValor,
        "Temps propi i temps impropi — efecte cinemàtic",
        chartCinematic,
        "cinematic"
    );


    actualitzarGrafica(
        "graficaGravitacional",
        factorGravitacionalValor,
        "Temps propi i temps impropi — efecte gravitacional",
        chartGravitacional,
        "gravitacional"
    );

}


/* =====================================================
   CREAR DADES DE LA GRÀFICA

   X = temps propi
   Y = temps impropi

   Si factor = 7:

   1 → 7
   2 → 14
   3 → 21
   ...
===================================================== */

function generarDades(factor) {

    if (
        !Number.isFinite(factor) ||
        factor <= 0
    ) {

        return [];

    }


    /*
        Es manté sempre el mateix
        interval de temps propi.

        Això permet comparar
        visualment les dues gràfiques.
    */

    const tempsMaxim =
        10;


    const nombrePunts =
        100;


    const dades = [];


    for (
        let i = 0;
        i <= nombrePunts;
        i++
    ) {

        const tempsPropi =
            (
                i /
                nombrePunts
            ) *
            tempsMaxim;


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
   GRÀFICA
===================================================== */

function actualitzarGrafica(
    canvasId,
    factor,
    titol,
    graficaAnterior,
    tipus
) {

    if (
        graficaAnterior !== null
    ) {

        graficaAnterior.destroy();

    }


    if (
        !Number.isFinite(factor) ||
        factor <= 0
    ) {

        return null;

    }


    const canvas =
        document.getElementById(
            canvasId
        );


    const dades =
        generarDades(
            factor
        );


    const grafica =
        new Chart(
            canvas,
            {

                type:
                    "line",


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
                                0,

                            tension:
                                0,

                            fill:
                                false

                        }

                    ]

                },


                options: {

                    responsive:
                        true,

                    maintainAspectRatio:
                        false,


                    animation: {

                        duration:
                            200

                    },


                    plugins: {

                        title: {

                            display:
                                true,

                            text:
                                titol,

                            color:
                                "#cfe2f3",

                            font: {

                                size:
                                    15

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
                                10,


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
                                    "#cfe2f3"

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
                                    "#cfe2f3"

                            }

                        }

                    }

                }

            }
        );


    return grafica;
}


/* =====================================================
   ACTUALITZACIÓ DE LES GRÀFIQUES
===================================================== */

function actualitzarTotesLesGrafiques() {

    calcular();

}


/* =====================================================
   INICIALITZACIÓ
===================================================== */

massaInput.value =
    "3.4e38";

periodeInput.value =
    "1e6";


massa.value =
    "3.4e38";

periode.value =
    "1e6";


calcular();
