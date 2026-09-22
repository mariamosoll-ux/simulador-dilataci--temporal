/* =====================================================
   CONSTANTS FÍSIQUES
===================================================== */

const G = 6.67430e-11;

const c = 299792458;


/* =====================================================
   CONTROLS
===================================================== */

const massaMantissa =
    document.getElementById("massaMantissa");

const massaExponent =
    document.getElementById("massaExponent");

const periodeMantissa =
    document.getElementById("periodeMantissa");

const periodeExponent =
    document.getElementById("periodeExponent");


/* =====================================================
   TEXTOS DELS CONTROLS
===================================================== */

const massaValor =
    document.getElementById("massaValor");

const massaMantissaValor =
    document.getElementById("massaMantissaValor");

const massaExponentValor =
    document.getElementById("massaExponentValor");

const periodeValor =
    document.getElementById("periodeValor");

const periodeMantissaValor =
    document.getElementById("periodeMantissaValor");

const periodeExponentValor =
    document.getElementById("periodeExponentValor");


/* =====================================================
   RESULTATS
===================================================== */

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

function formatScientific(valor, decimals = 3) {

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
   MASSA
===================================================== */

function obtenirMassa() {

    const mantissa =
        Number(
            massaMantissa.value
        );


    const exponent =
        Number(
            massaExponent.value
        );


    return (

        mantissa *

        Math.pow(
            10,
            exponent
        )

    );

}


/* =====================================================
   PERÍODE
===================================================== */

function obtenirPeriode() {

    const mantissa =
        Number(
            periodeMantissa.value
        );


    const exponent =
        Number(
            periodeExponent.value
        );


    /*
        El període és sempre positiu.
    */

    return (

        mantissa *

        Math.pow(
            10,
            exponent
        )

    );

}


/* =====================================================
   ACTUALITZAR CONTROLS
===================================================== */

function actualitzarControls() {

    const M =
        obtenirMassa();


    const T =
        obtenirPeriode();


    massaValor.innerHTML =
        formatScientific(M)
        +
        " kg";


    periodeValor.innerHTML =
        formatScientific(T)
        +
        " s";


    massaMantissaValor.textContent =
        Number(
            massaMantissa.value
        )
        .toFixed(1)
        .replace(".", ",");


    massaExponentValor.textContent =
        massaExponent.value;


    periodeMantissaValor.textContent =
        Number(
            periodeMantissa.value
        )
        .toFixed(1)
        .replace(".", ",");


    periodeExponentValor.textContent =
        periodeExponent.value;

}


/* =====================================================
   CÀLCUL PRINCIPAL
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

            )

            /

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

            v * v

        )

        /

        (

            c * c

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

    }

    else {

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

            2 *

            G *

            M

        )

        /

        (

            R *

            c *

            c

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

    }

    else {

        factorGravitacionalValor =
            Infinity;

    }


    /* =================================================
       MOSTRAR RESULTATS
    ================================================= */

    radi.innerHTML =

        formatScientific(R);


    velocitat.innerHTML =

        formatScientific(v);


    tempsCinematic.innerHTML =

        formatScientific(

            factorCinematicValor

        );


    factorCinematic.innerHTML =

        formatScientific(

            factorCinematicValor

        );


    radiGravitacional.innerHTML =

        formatScientific(R);


    tempsGravitacional.innerHTML =

        formatScientific(

            factorGravitacionalValor

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
   DADES DE LA GRÀFICA
===================================================== */

function generarDades(factor) {

    if (

        !Number.isFinite(factor) ||

        factor <= 0

    ) {

        return [];

    }


    const dades = [];


    /*
        El temps propi va de 0 a 10 s.
        Cada punt representa una equivalència
        entre temps propi i temps impropi.
    */

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

    id,

    factor,

    titol,

    graficaAnterior

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

        document.getElementById(id);


    const dades =

        generarDades(factor);


    const novaGrafica =

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

                                        return
                                            "Equivalència temporal";

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
                                            formatScientific(x)
                                            +
                                            " s",

                                            "Temps impropi: "
                                            +
                                            formatScientific(y)
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
                                    "#cfe2f3",


                                callback:
                                    function(value) {

                                        return formatScientific(
                                            value
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
   ESDEVENIMENTS DELS SLIDERS
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
   INICIAR
===================================================== */

calcular();
