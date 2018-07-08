var projects = [{
    "name": "Number Spiral Generator",
    "link": {
        "href": "https://www.github.com/kpberry/spirals",
        "text": "Github"
    },
    "info": [
        "Calculates values for and generates square or hexagon tiled visualizations of number sequences",
        "Runtime Java compiler allows for the use of arbitrary Java expressions as filter criteria for sequence elements",
        "Tool for creating and combining color schemes allows for the creation at runtime of complex highlight patterns for generated",
        "Can efficiently compute elements of various built-in series, such as prime numbers, hailstone sequences, and English number name lengths"
    ],
    "images": [
        "res/spirals/1.png",
        "res/spirals/2.png",
        "res/spirals/3.png",
        "res/spirals/4.png",
        "res/spirals/5.png",
        "res/spirals/6.png",
        "res/spirals/7.png",
        "res/spirals/8.png"
    ]
}, {
    "name": "C Utilities",
    "link": {
        "href": "https://github.com/kpberry/c-utils",
        "text": "Github"
    },
    "info": [
        "Various utility data structures written for C",
        "Includes efficient and safe Hashmap, BST, and ArrayList implementations",
        "Hashmap implementation runs 3 times as fast as Go's built in map on an insertion/deletion benchmark with billions of entries"
    ]
}, {
    "name": "LC3 Simulator",
    "link": {
        "href": "https://github.com/kpberry/LC3",
        "text": "Github"
    }, 
    "info": [
        "Fully featured 2-pass assembler, disassembler, and simulator for the LC3 (Little Computer 3)",
        "Includes implementations of all LC3 trap instructions except PUTSP"
    ]
}, {
    "name": "Particle Physics Engine",
    "link": {
        "href": "https://www.github.com/kpberry/physics-engine",
        "text": "Github"
    },
    "info": [
        "Calculates forces and interactions among particles at arbitrary distances",
        "Forces can be set up easily based on arbitrary rules by following a Force template",
        "Includes variable Gravitational, Electrostatic, Spring, Resistive Fluid Forces",
        "Includes the \"Love\" Force, which increases in magnitude as the square of the displacement between two particles and is, ostensibly, the strongest force of all",
        "Capable of high-precision calculations due to a method that reduces the size and increases the frequency of computations",
        "Simulations obey conservation of energy, mass, and momentum (when there are no external forces)"
    ],
    "images": [
        "res/physics/1.png",
        "res/physics/2.png",
        "res/physics/3.png",
        "res/physics/4.png",
        "res/physics/5.png",
        "res/physics/6.png",
        "res/physics/7.png",
        "res/physics/8.png"
    ]
}, {
    "name": "Computer Algebra System",
    "link": {
        "href": "https://www.github.com/kpberry/cas",
        "text": "Github"
    },
    "info": [
        "Evaluates symbolic expressions of arbitrary parameter lengths",
        "Handles operations on Vector, Matrix, and Complex values",
        "Evaluates convergent summations, standard and hyperbolic trig functions, and derivatives",
        "Can manipulate algebraic functions and perform term simplification and combination",
        "Graphs functions, equations, and parametric equations and provides solutions at points",
        "Dynamic, context sensitive interface written with TKinter"
    ]
}, {
    "name": "Differential Equation Grapher",
    "link": {
        "href": "graphing.html",
        "text": "Web App"
    },
    "info": [
        "Graphs slope and direction fields of arbitrary single differential equations and systems of autonomous differential equations",
        "Plots approximate solutions to differential equations using Euler's method, Improved Euler's method, or 4th order Runge-Kutta methods",
        "Graphs component plots for arbitrary differential equations and systems of differential equations"
    ]
}, {
    "name": "Readability Analyzer",
    "link": {
        "href": "readability.html",
        "text": "Web App"
    },
    "info": [
        "Counts text features including sentences, characters, and syllables",
        "Analyzes text by several metrics, including Flesch-Reading ease, the Gunning Fog Index, and others to produce an average text \"grade level\""
    ]
}, {
    "name": "Clapchat",
    "link": {
        "href": "https://github.com/kpberry/clapchat",
        "text": "Github"
    },
    "info": [
        "Command line app that takes a picture when the user claps (or snaps)",
        "Uses a convolution of a Gaussian kernel over the raw audio signal to determine when a clap happens",
        "Kernel parameters determined through exhaustive grid search over the space of offsets and magnitueds",
        "Achieves 77% accuracy in clap identification when tested on a hand-made dataset of 350 miscellaneous noises and 350 claps",
    ]
}, {
    "name": "Boids",
    "link": {
        "href": "https://kpberry.github.io/boids.html",
        "text": "Web App"
    },
    "info": [
        "Implementation of Craig Reynolds's Boids (bird-oid objects) flocking algorithm",
        "Has menu for tuning flock parameters such as cohesion, alignment, separation, velocity, and viewing radius",
        "Uses an optimized space partitioning algorithm for neighbor detection which allows for flocks with over 10000 individuals",
        "Includes visualization of boid sight lines"
    ]
}, {
    "name": "Plaidify",
    "link": {
        "href": "plaidify.html",
        "text": "Web App"
    },
    "info": [
        "Takes a foreground image and a cropped background plaid and produces a plaid interpolation of the two",
        "Uses the grayscale of the original image and a threshold intensity to determine the \"plaidness\" of a pixel in the final image to ensure the maintenance of edges and clearly defined shapes"
    ]
}];