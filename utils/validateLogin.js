/**
 * This function is located in the '/utils' so that it can be tested by the unit tests
 * 
 * validateLogin
 * - takes 'input' (which is the user input in a text field) as a parameter.
 * - returns an empty string in case the input value complies with all validations.
 * - returns an error message in case the input value must be corrected by the user
 */
export const validateLogin = (input) => {
    let error = '';
    let testInput = input.replaceAll(' ', '');  // remove all empty spaces from input

    if (!testInput) {                           // input is empty
      error = 'Name is required.';
    } else if (testInput.length < 3) {          // input is too short
      error = 'Minimum length is 3 characters.';
    } else if (testInput.length > 10) {         // input is too long
      error = 'Maximum length is 10 characters.';
    }

    return error;
}