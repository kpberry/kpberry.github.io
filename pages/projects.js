var projects = [{
    "name": "image-to-ascii",
    "link": {
        "href": "https://github.com/kpberry/image-to-ascii",
        "text": "Github"
    },
    "info": [
        "Converts images and gifs to ascii art",
        "Capable of converting 120+ images per second on a single thread",
        "Supports multiple input/output formats, custom fonts, alphabets, character selection metrics, and multithreading",
        "Uses hand-coded SIMD instructions for improved performance"
    ],
    "images": [
        "res/image-to-ascii/you_know_the_rules_bw.gif",
        "res/image-to-ascii/fuji_bw.gif",
        "res/image-to-ascii/fuji.png",
        "res/image-to-ascii/mandelbrot_small.gif",
        "res/image-to-ascii/stvincent_bw.gif"
    ]
}, {
    "name": "pinpointer",
    "link": {
        "href": "https://github.com/kpberry/pinpointer",
        "text": "Github"
    },
    "info": [
        "Performs fast point-in-province and point-in-country queries",
        "Uses a space partitioning tree to achieve millions of point-in-region queries per second",
        "Has helper functions for loading country and province data and using them to construct partition trees",
        "Has an api server for making queries via http"
    ],
    "images": [
        "res/pinpointer/country_tree_10.png",
        "res/pinpointer/province_tree_10.png"
    ]
}, {
    "name": "detect-duplicates",
    "link": {
        "href": "https://github.com/kpberry/detect-duplicates",
        "text": "Github"
    },
    "info": [
        "Recursively finds all of the files in a directory",
        "Runs in O(number of files) time while only using O(largest file in directory) memory",
        "Can check the entire linux kernel repository (roughly 5GB, over 70,000 files) in about 5 seconds"
    ]
}, {
    "name": "Rolling a d7 in Finite(ish) Time",
    "link": {
        "href": "https://raw.githubusercontent.com/kpberry/dice/main/dice.pdf",
        "text": "Paper"
    },
    "info": [
        "Paper analyzing the problem of simulating dice with any number of faces given only a standard die set",
        "Presents expected finite-time algorithm for rolling dice with any number of faces",
        "Analyzes expected number of total throws and total dice rolled for any die set and target dice",
        "Proves that number of expected throws can be arbitrarily low if the number of dice is not limited",
        "Proves that increasing the number of dice never increases the number of expected throws",
        "Finds an interesting case where the number of dice ever rolled can be efficiently minimized"
    ]
}, {
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
    "name": "Minimum Vertex Cover Algorithms",
    "link": {
        "href": "https://github.com/kpberry/minimum-vertex-cover-algorithms",
        "text": "Github"
    },
    "info": [
        "Set of implementations of state of the art minimum vertex cover algorithms",
        "Implements one branch and bound, two local search, and four approximation algorithms",
        "Evaluates runtime and relative error of each algorithm on 11 real-world datasets with up to 14,000 vertices and 98,000 edges",
        "Proposes and evaluates a novel greedy approximation algorithm which achieves smaller vertex cover sizes and significant time reductions over the state of the art [Fast VC](http://ijcai.org/Proceedings/15/Papers/111.pdf) algorithm on 10 out of 11 tested datasets"
    ]
}, {
    "name": "Readability Analyzer",
    "link": {
        "href": "readability.html",
        "text": "Web App"
    },
    "info": [
        "Counts text features including sentences, characters, and syllables",
        "Uses an MLP regressor with 10 hidden neurons to count syllables for out-of-vocabulary words. [Trained on over 130,000 English words, and achieves over 89% validation accuracy on a held out test set of 1,300 words](https://kpberry.github.io/syllable_counter.html)",
        "Correctly predicts syllable counts for very long out-of-vocabulary words, e.g., supercalifragilisticexpialidocious (14 syllables), floccinaucinihilipilification (12 syllables), and pneumonoultramicroscopicsilicovolcanoconiosis (18 syllables), despite having only 2 training examples with more than 9 syllables",
        "Capable of analyzing large corpuses such as Tolstoy's <i>War and Peace</i> in under 10 seconds",
        "Analyzes text by several metrics, including Flesch-Reading ease, the Gunning Fog Index, and others to produce an average text \"grade level\""
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
    "name": "Plaidify",
    "link": {
        "href": "plaidify.html",
        "text": "Web App"
    },
    "info": [
        "Takes a source image and a plaid image and turns the source image plaid",
        "Uses local pixel gradients to \"wrap\" the plaid around the source image while preserving edges and intensities",
        "Can be used as a general style transfer from textured style images to content images"
    ],
    "images": [
        "res/plaidify/fuji-plaid.png",
        "res/plaidify/guitar-plaid.png"
    ]
}, {
    "name": "Boids",
    "link": {
        "href": "https://kpberry.github.io/boids.html",
        "text": "Web App"
    },
    "info": [
        "Implementation of Craig Reynolds's [Boids](http://www.red3d.com/cwr/boids/) (bird-oid objects) flocking algorithm",
        "Has menu for tuning flock parameters such as cohesion, alignment, separation, velocity, and viewing radius",
        "Uses an optimized space partitioning algorithm for neighbor detection which allows for flocks with over 10000 individuals",
        "Includes visualization of boid sight lines"
    ]
}, {
    "name": "Ivan Allen Digital Archive Interface",
    "link": {
        "href": "http://allenarchive-dev.iac.gatech.edu/elasticsearch",
        "text": "Website"
    },
    "info": [
        "<b>NOTE:</b> <i> I worked on this project in 2018 and it has since been passed off to new maintainers. The site has often been broken or unavailable since they have been working on it, so it may not work for you if you try to go there.</i>",
        "Search interface, graph visualization, and wiki-style transcription editing for the Ivan Allen Digital Archive, a repository of documents from the mayorship of Ivan Allen",
        "Uses an [elasticsearch](https://www.elastic.co/) database for performing efficient fuzzy searches through document collection",
        "Graph visualization allows for complex boolean searches and filters to be displayed visually, e.g., \"Find all documents connecting Cecil Alexander and Ivan Allen in 1967\" can be evaluated with 3 filters from dropdown menus",
        "Used Google's [Tesseract](https://github.com/tesseract-ocr/tesseract) optical character recognition engine to extract text from over 10,000 PDF scans of documents",
        "Used [spaCy](https://spacy.io/) NLP to generate named entity tags which are used for searching and for connecting nodes in the graph visualization",
        "Uses a modified version of the [Scripto](https://omeka.org/classic/docs/Plugins/Scripto/) [Omeka](https://omeka.org/) plugin to allow for crowdsourced transcription corrections"
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
        "Fully featured 2-pass assembler, disassembler, and simulator for the [LC3](https://en.wikipedia.org/wiki/LC-3) (Little Computer 3)",
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
},];
