// Fonction calculant la moyenne des nombres d'un tableau et renvoyant un nombre entier
exports.average = (array) => {
    let sum = 0; 
    // Variable pour stocker la somme des nombres du tableau
    for (let nb of array) { 
        // Boucle pour parcourir tous les nombres du tableau
      sum += nb; 
      // Ajouter chaque nombre au total dans la variable "sum"
    };
    const average = sum / array.length; 
    // Calculer la moyenne en divisant la somme par le nombre d'éléments dans le tableau
    return Math.round(average); 
    // Renvoyer la moyenne arrondie au nombre entier le plus proche
  };
  
