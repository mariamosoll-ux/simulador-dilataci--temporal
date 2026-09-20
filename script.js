/* =====================================================
   CONSTANTS FÍSIQUES
===================================================== */

const G = 6.67430e-11;

const c = 299792458;



/* =====================================================
   ELEMENTS CINEMÀTICS
===================================================== */

const massKinematic =
    document.getElementById("massKinematic");

const period =
    document.getElementById("period");


const massKinematicValue =
    document.getElementById("massKinematicValue");

const periodValue =
    document.getElementById("periodValue");


const radiusResult =
    document.getElementById("radiusResult");

const velocityResult =
    document.getElementById("velocityResult");

const kinematicTimeResult =
    document.getElementById("kinematicTimeResult");



/* =====================================================
   ELEMENTS GRAVITACIONALS
===================================================== */

const massGravity =
    document.getElementById("massGravity");

const spin =
    document.getElementById("spin");


const massGravityValue =
    document.getElementById("massGravityValue");

const spinValue =
    document.getElementById("spinValue");


const gravityRadiusResult =
    document.getElementById("gravityRadiusResult");

const gravityTimeResult =
    document.getElementById("gravityTimeResult");

const gravityFactorResult =
    document.getElementById("gravityFactorResult");



/* =====================================================
   FUNCIONS DE FORMAT
===================================================== */

function scientific(value, digits = 3) {

    if (!isFinite(value)) {

        return "—";

    }

    return value.toExponential(digits);

}



function formatMass(value) {

    const solarMasses =
        value / 1.989e30;

    return (
        value.toExponential(3) +
        " kg (" +
        solarMasses.toFixed(2) +
        " M☉)"
    );

}



function formatNumber(value, digits = 2) {

    return value.toLocaleString(
        "ca-ES",
        {
            maximumFractionDigits: digits
        }
    );

}



/* =====================================================
   CÀLCUL CINEMÀTIC
===================================================== */

function calculateKinematic() {

    const M =
        Number(massKinematic.value);

    const T =
        Number(period.value);



    /*

        R = ∛(GMT² / 4π²)

    */

    const R =
        Math.cbrt(
            (G * M * T * T) /
            (4 * Math.PI * Math.PI)
        );



    /*

        v = √(GM/R)

    */

    const v =
        Math.sqrt(
            (G * M) / R
        );



    /*

        t = t0 / √(1-v²/c²)

        t0 = 1 s

    */

    const factor =
        1 -
        (v * v) /
        (c * c);


    let t;


    if (factor > 0) {

        t =
            1 /
            Math.sqrt(factor);

    } else {

        t = Infinity;

    }



    /* =================================================
       ACTUALITZAR RESULTATS
    ================================================= */

    massKinematicValue.textContent =
        formatMass(M);


    periodValue.textContent =
        formatNumber(T) + " s";


    radiusResult.textContent =
        scientific(R);


    velocityResult.textContent =
        scientific(v);


    kinematicTimeResult.textContent =
        isFinite(t)
            ? t.toFixed(9)
            : "No definit";



    /* =================================================
       ACTUALITZAR GRÀFICA
    ================================================= */

    updateKinematicChart(M, T);

}



/* =====================================================
   GRÀFICA CINEMÀTICA
===================================================== */

let kinematicChart = null;



function updateKinematicChart(M, selectedPeriod) {

    const periods = [];

    const times = [];



    /*
        Es creen diferents períodes al voltant
        del valor seleccionat.
    */

    const minimum =
        Math.max(
            1,
            selectedPeriod / 10
        );


    const maximum =
        selectedPeriod * 10;



    for (let i = 0; i < 40; i++) {

        const T =
            minimum *
            Math.pow(
                maximum / minimum,
                i / 39
            );


        const R =
            Math.cbrt(
                (G * M * T * T) /
                (4 * Math.PI * Math.PI)
            );


        const v =
            Math.sqrt(
                (G * M) / R
            );


        const factor =
            1 -
            (v * v) /
            (c * c);


        const t =
            factor > 0
                ? 1 / Math.sqrt(factor)
                : null;


        periods.push(T);

        times.push(t);

    }



    /*
        Punt que correspon al valor actual
    */

    const selectedIndex =
        times.reduce(
            (closest, value, index) => {

                if (
                    value === null ||
                    times[closest] === null
                ) {

                    return closest;

                }

                return Math.abs(
                    periods[index] - selectedPeriod
                ) <
                Math.abs(
                    periods[closest] - selectedPeriod
                )
                    ? index
                    : closest;

            },
            0
        );



    /*
        Destruir la gràfica anterior
        i crear-ne una de nova.
    */

    if (kinematicChart !== null) {

        kinematicChart.destroy();

    }



    kinematicChart =
        new Chart(
            document.getElementById(
                "kinematicChart"
            ),
            {

                type: "line",

                data: {

                    labels: periods.map(
                        value =>
                            value.toExponential(1)
                    ),

                    datasets: [

                        {

                            label:
                                "Temps impropi t (s)",

                            data: times,

                            borderWidth: 2,

                            tension: 0.2,

                            pointRadius:
                                periods.map(
                                    (_, index) =>
                                        index === selectedIndex
                                            ? 6
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
                                "Dilatació temporal cinemàtica"

                        }

                    },



                    scales: {

                        x: {

                            title: {

                                display: true,

                                text:
                                    "Període orbital T (s)"

                            }

                        },



                        y: {

                            title: {

                                display: true,

                                text:
                                    "Temps impropi t (s)"

                            }

                        }

                    }

                }

            }
        );

}



/* =====================================================
   CÀLCUL GRAVITACIONAL
===================================================== */

function calculateGravity() {

    const M =
        Number(massGravity.value);

    const a =
        Number(spin.value);



    /*

        Radi considerat:

        r = GM/c² · (1 + √(1-a²))

    */

    const r =
        (G * M / (c * c)) *
        (
            1 +
            Math.sqrt(
                1 - a * a
            )
        );



    /*

        Dilatació temporal:

        t = t0 / √(1 - 2GM/rc²)

        t0 = 1 s

    */

    const factor =
        1 -
        (2 * G * M) /
        (r * c * c);


    let t;


    if (factor > 0) {

        t =
            1 /
            Math.sqrt(factor);

    } else {

        t = Infinity;

    }



    /* =================================================
       ACTUALITZAR RESULTATS
    ================================================= */

    massGravityValue.textContent =
        formatMass(M);


    spinValue.textContent =
        a.toFixed(3);


    gravityRadiusResult.textContent =
        scientific(r);


    gravityTimeResult.textContent =
        isFinite(t)
            ? t.toFixed(9)
            : "No definit";


    gravityFactorResult.textContent =
        isFinite(t)
            ? t.toFixed(6)
            : "No definit";



    /* =================================================
       ACTUALITZAR GRÀFICA
    ================================================= */

    updateGravityChart(M, a);

}



/* =====================================================
   GRÀFICA GRAVITACIONAL
===================================================== */

let gravityChart = null;



function updateGravityChart(M, selectedSpin) {

    const spins = [];

    const times = [];



    for (let i = 0; i <= 50; i++) {

        const a =
            i / 50 * 0.998;


        const r =
            (G * M / (c * c)) *
            (
                1 +
                Math.sqrt(
                    1 - a * a
                )
            );


        const factor =
            1 -
            (2 * G * M) /
            (r * c * c);


        const t =
            factor > 0
                ? 1 / Math.sqrt(factor)
                : null;


        spins.push(a);

        times.push(t);

    }



    /*
        Buscar el punt més proper
        a l'spin seleccionat.
    */

    let selectedIndex = 0;

    let smallestDifference =
        Infinity;


    for (let i = 0; i < spins.length; i++) {

        const difference =
            Math.abs(
                spins[i] -
                selectedSpin
            );


        if (
            difference <
            smallestDifference
        ) {

            smallestDifference =
                difference;

            selectedIndex = i;

        }

    }



    /*
        Destruir la gràfica anterior.
    */

    if (gravityChart !== null) {

        gravityChart.destroy();

    }



    gravityChart =
        new Chart(
            document.getElementById(
                "gravityChart"
            ),
            {

                type: "line",


                data: {

                    labels: spins.map(
                        value =>
                            value.toFixed(2)
                    ),


                    datasets: [

                        {

                            label:
                                "Temps impropi t (s)",

                            data: times,

                            borderWidth: 2,

                            tension: 0.2,

                            pointRadius:
                                spins.map(
                                    (_, index) =>
                                        index === selectedIndex
                                            ? 6
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
                                "Dilatació temporal gravitacional"

                        }

                    },


                    scales: {

                        x: {

                            title: {

                                display: true,

                                text:
                                    "Spin adimensional"

                            }

                        },


                        y: {

                            title: {

                                display: true,

                                text:
                                    "Temps impropi t (s)"

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

/*
    Cada vegada que es mou una barra,
    es tornen a fer els càlculs i
    s'actualitza la gràfica.
*/


massKinematic.addEventListener(
    "input",
    calculateKinematic
);


period.addEventListener(
    "input",
    calculateKinematic
);


massGravity.addEventListener(
    "input",
    calculateGravity
);


spin.addEventListener(
    "input",
    calculateGravity
);



/* =====================================================
   CÀLCUL INICIAL
===================================================== */

calculateKinematic();

calculateGravity();
