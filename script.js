/* ==========================================================
   CONSTANTS FÍSIQUES
========================================================== */

const G = 6.67430e-11;
const c = 299792458;


/* ==========================================================
   ELEMENTS CINEMÀTICS
========================================================== */

const massKinematic = document.getElementById("massKinematic");
const period = document.getElementById("period");

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


/* ==========================================================
   ELEMENTS GRAVITACIONALS
========================================================== */

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


/* ==========================================================
   FORMAT DELS NÚMEROS
========================================================== */

function scientific(value, digits = 3) {

    if (!isFinite(value)) {
        return "—";
    }

    return value.toExponential(digits);
}


function formatMass(value) {

    const solarMasses =
        value / 1.989e30;

    return `${scientific(value)} kg (${solarMasses.toFixed(2)} M☉)`;
}


function formatNumber(value, digits = 3) {

    if (!isFinite(value)) {
        return "—";
    }

    return value.toLocaleString("ca-ES", {
        maximumFractionDigits: digits
    });
}


/* ==========================================================
   CÀLCUL CINEMÀTIC
========================================================== */

function calculateKinematic() {

    const M = Number(massKinematic.value);
    const T = Number(period.value);

    /*
        R = ∛(GMT² / 4π²)
    */

    const R = Math.cbrt(
        (G * M * T * T) /
        (4 * Math.PI * Math.PI)
    );


    /*
        v = √(GM/R)
    */

    const v = Math.sqrt(
        (G * M) / R
    );


    /*
        t = t0 / √(1-v²/c²)

        t0 = 1 s
    */

    let t;

    const factor =
        1 - (v * v) / (c * c);

    if (factor > 0) {

        t = 1 / Math.sqrt(factor);

    } else {

        t = Infinity;

    }


    /* Resultats */

    massKinematicValue.textContent =
        formatMass(M);

    periodValue.textContent =
        formatNumber(T) + " s";

    radiusResult.textContent =
        scientific(R) + " m";

    velocityResult.textContent =
        scientific(v);

    kinematicTimeResult.textContent =
        isFinite(t)
            ? t.toFixed(9)
            : "No definit";


    updateKinematicChart(M, T);
}


/* ==========================================================
   GRÀFICA CINEMÀTICA
========================================================== */

let kinematicChart;


function updateKinematicChart(M, T) {

    const periods = [];
    const times = [];

    const minimum =
        Math.max(1, T / 10);

    const maximum =
        T * 10;

    for (let i = 0; i < 30; i++) {

        const currentT =
            minimum *
            Math.pow(
                maximum / minimum,
                i / 29
            );

        const R = Math.cbrt(
            (G * M * currentT * currentT) /
            (4 * Math.PI * Math.PI)
        );

        const v = Math.sqrt(
            (G * M) / R
        );

        const factor =
            1 - (v * v) / (c * c);

        const t =
            factor > 0
                ? 1 / Math.sqrt(factor)
                : null;

        periods.push(currentT);
        times.push(t);
    }


    const data = {
        labels: periods.map(p =>
            scientific(p, 1)
        ),

        datasets: [{
            label: "Temps impropi t (s)",
            data: times,
            borderWidth: 2,
            tension: 0.2,
            pointRadius: 3
        }]
    };


    if (kinematicChart) {
        kinematicChart.destroy();
    }


    kinematicChart =
        new Chart(
            document.getElementById("kinematicChart"),
            {
                type: "line",

                data: data,

                options: {
                    responsive: true,
                    maintainAspectRatio: false,

                    plugins: {
                        title: {
                            display: true,
                            text:
                                "Dilatació temporal cinemàtica en funció del període orbital"
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


/* ==========================================================
   CÀLCUL GRAVITACIONAL
========================================================== */

function calculateGravity() {

    const M = Number(massGravity.value);
    const a = Number(spin.value);


    /*
        Radi gravitacional de Kerr:

        r+ = GM/c² · (1 + √(1-a²))
    */

    const gravitationalRadius =
        (G * M / (c * c)) *
        (
            1 +
            Math.sqrt(
                1 - a * a
            )
        );


    /*
        Per evitar que l'expressió sigui negativa,
        es comprova el terme de l'arrel.
    */

    const factor =
        1 -
        (2 * G * M) /
        (
            gravitationalRadius *
            c *
            c
        );


    let t;


    if (factor > 0) {

        /*
            t0 = t √(1 - 2GM/rc²)

            Per t0 = 1 s:

            t = 1 / √(1 - 2GM/rc²)
        */

        t =
            1 / Math.sqrt(factor);

    } else {

        t = Infinity;

    }


    massGravityValue.textContent =
        formatMass(M);

    spinValue.textContent =
        a.toFixed(3);

    gravityRadiusResult.textContent =
        scientific(gravitationalRadius) +
        " m";

    gravityTimeResult.textContent =
        isFinite(t)
            ? t.toFixed(9)
            : "No definit";

    gravityFactorResult.textContent =
        isFinite(t)
            ? t.toFixed(6)
            : "No definit";


    updateGravityChart(M, a);
}


/* ==========================================================
   GRÀFICA GRAVITACIONAL
========================================================== */

let gravityChart;


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
            (
                r *
                c *
                c
            );

        const t =
            factor > 0
                ? 1 / Math.sqrt(factor)
                : null;

        spins.push(a);
        times.push(t);
    }


    const data = {

        labels: spins.map(a =>
            a.toFixed(2)
        ),

        datasets: [

            {
                label:
                    "Temps impropi t (s)",

                data: times,

                borderWidth: 2,

                tension: 0.2,

                pointRadius: function(context) {

                    const value =
                        spins[context.dataIndex];

                    return Math.abs(
                        value - selectedSpin
                    ) < 0.02
                        ? 6
                        : 2;
                }
            }

        ]
    };


    if (gravityChart) {
        gravityChart.destroy();
    }


    gravityChart =
        new Chart(
            document.getElementById("gravityChart"),
            {
                type: "line",

                data: data,

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {

                        title: {

                            display: true,

                            text:
                                "Dilatació temporal gravitacional en funció de l'spin"

                        }

                    },

                    scales: {

                        x: {

                            title: {

                                display: true,

                                text:
                                    "Spin adimensional a"

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


/* ==========================================================
   ACTUALITZACIÓ AUTOMÀTICA
========================================================== */

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


/* ==========================================================
   INICIALITZACIÓ
========================================================== */

calculateKinematic();
calculateGravity();
