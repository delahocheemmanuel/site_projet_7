const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => {
        // Validation de l'email avec une expression régulière
        // Par exemple, vérifier si l'email est au format valide
        const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
        return emailRegex.test(value);
      },
      message: 'Veuillez fournir un email valide.',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 6, // Exemple de validation de longueur minimale
  },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);


