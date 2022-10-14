
//=================================================================================

//functions.
//SPHERE
const Sphere = (parent) => {
    //Summation of x*x;

    let val = 0;
    for (let i = 0; i < Dimensions; i++) {
        val += parent[i] * parent[i];
    }
    return val;
}

//ROSENBROCK
const Rosenbrock = (parent) => {
    let val=0;
    for (let i = 0; i < Dimensions - 1; i++) {
        val += 100 * (parent[i+1] - parent[i] * parent[i]) * (parent[i+1] - parent[i] * parent[i]) + (1 - parent[i]) * (1 - parent[i]);
    }
    return val;
}

//RASTRIGIN
const Rastrigin = (parent) => {

    let n = 2;
    let A = 10;
    let val = A * n;
    for (let i = 0; i < Dimensions; i++) {
        val += (parent[i] * parent[i] - A * Math.cos(Math.PI * 2 * parent[i]));
    }
    return val;
}

//ACKLEY
const Ackley = (parent) => {
    //only 2 parameter
    let x = parent[0];
    let y = parent[1];
    let val = -20*Math.exp(-0.2*Math.sqrt(0.5*(x*x+y*y))) - Math.exp(0.5*(Math.cos(2*Math.PI*x)+Math.cos(2*Math.PI*y))) + (Math.E + 20);
    return val;

}
//=================================================================================

// evalute function 
const evaluate = (parent) => {

    if (function_optimization == "RASTRIGIN") {
        return Rastrigin(parent);
    } else if (function_optimization == "ROSENBROCK") {
        return Rosenbrock(parent);
    } else if (function_optimization == "ACKLEY") {
        return Ackley(parent);
    } else if (function_optimization == "SPHERE") {
        return Sphere(parent);
    }
}

// calculate fitness 
const fitness = (parent) => {
    if (evaluate(parent) == 0) return 9999999.999;
    else return (1 / evaluate(parent));
}

//=================================================================================

// generate population 
const InitializePopulation = () => {
    let chromosome;
    let element;
    for (let i = 1; i <= P_size; i++){
        element = [];
        for (let i = 0; i < Dimensions; i++){
            chromosome = Lower + (Upper - Lower) * Math.random();
            element.push(chromosome);
        }
        population.push(element);
    }
}

//finding best
const findBestFitnessIDX = () => {
    let bestFit = fitness(population[0]);
    let bestIDX = 0;
    for (let i = 1; i < P_size; i++) {
        let currentFitness = fitness(population[i]);
        if (bestFit < currentFitness) {
            bestIDX = i;
            bestFit = currentFitness;
        }
    }
    return bestIDX;
}

//Mutation
const Mutation = (bestFit, random1, random2) => {
    let scale_factor = 0.5; // beta     
    let trial = new Array(Dimensions);
    
    for (let i = 0; i < Dimensions; i++) {
        trial[i] = bestFit[i] + scale_factor * (random1[i] - random2[i]);
    }
    return trial;
}

//Crossover
const CrossOver = (parent, trial) => {
    let recombine_prob = 0.70; //crossover probability
    let child = new Array(Dimensions);

    //binomial crossover
    const Binomial = (child) => {
        let k = Math.floor(Math.random() * Dimensions); //0 -> dim exclisive
        for (let i = 0; i < Dimensions; i++){
            if (i == k || Math.random() < recombine_prob) {
                child[i] = trial[i];
            } else {
                child[i] = parent[i];
            }
        }
        return child;
    }

    return Binomial(child);
    // return Binomial(child);
}


//program starts from here --

//Domains and Dimentions
let population = [];
let P_size = 20;

// let Lower=-5;
// let Upper=5;
// let Dimensions = 2;
// let function_optimization = "RASTRIGIN";

// let Lower=-5;
// let Upper=5;
// let Dimensions = 2;
// let function_optimization = "ACKLEY";

let Lower=-99999999;
let Upper=99999999;
let Dimensions = 5;
let function_optimization = "ROSENBROCK";

// let Lower=-99999999;
// let Upper=99999999;
// let Dimensions = 5;
// let function_optimization = "SPHERE";


let generations = 1;
InitializePopulation();

while (generations <= 100) {

    let bestFitIDX = findBestFitnessIDX();
    let trial_vector; //array of trial vector
    let newPopulation = [];
    
    //current generation best
    console.log(`Generation ${generations}: ${evaluate(population[bestFitIDX])}`)

    // looping population for mutation and crossover
    for (let i = 0; i < P_size; i++){
        
        let random_idx_1 = Math.floor(Math.random() * P_size);
        while (random_idx_1 == i || random_idx_1 == bestFitIDX) {
            random_idx_1 = Math.floor(Math.random() * P_size);
        }

        let random_idx_2 = Math.floor(Math.random() * P_size);
        while (random_idx_2 == i || random_idx_2 == bestFitIDX || random_idx_2 == random_idx_1) {
            random_idx_2 = Math.floor(Math.random() * P_size);
        }
        //mutation  returns trial vector; 
        trial_vector = Mutation(population[bestFitIDX], population[random_idx_1], population[random_idx_2])
        // console.log(trial_vector)
        //cross over each trial_vector with their parent and trial
        child = CrossOver(population[i], trial_vector)
        newPopulation.push(child);

    }
    //assigning new population to next generation
    population = newPopulation;
    generations++;
}
// console.log(population);
