// Test error handling with Symbol access
const error = {
  code: 'SQLITE_CONSTRAINT',
  rawCode: undefined,
};

// Add Symbol cause property like libsql does
const causeSymbol = Symbol('cause');
error[causeSymbol] = {
  code: 'SQLITE_CONSTRAINT',
  proto: {
    message: 'SQLite error: UNIQUE constraint failed: users.email',
    code: 'SQLITE_CONSTRAINT'
  }
};

console.log('Testing error handling with Symbol...');
console.log('Error object keys:', Object.keys(error));
console.log('Error object symbols:', Object.getOwnPropertySymbols(error));

let errorMessageString = '';

// Get the error message from the appropriate location
// Check the main error object first
if (error.message) {
    errorMessageString = error.message;
}
// Check for Symbol cause property (libsql uses Symbol for cause)
else {
    // Look for Symbol properties
    const symbols = Object.getOwnPropertySymbols(error);
    console.log('Found symbols:', symbols);
    for (const symbol of symbols) {
        console.log('Checking symbol:', symbol.toString());
        console.log('Symbol value:', error[symbol]);
        if (error[symbol] && error[symbol].proto && error[symbol].proto.message) {
            errorMessageString = error[symbol].proto.message;
            console.log('Found error message in Symbol:', errorMessageString);
            break;
        }
    }
}

console.log('Error message string for processing:', errorMessageString);

// Check if it's a constraint error
if (errorMessageString && (errorMessageString.includes('SQLITE_CONSTRAINT') || errorMessageString.includes('UNIQUE constraint failed'))) {
    console.log('Constraint error detected');
    if (errorMessageString.includes('users.photon_id')) {
        console.log('Photon ID duplicate detected');
    } else if (errorMessageString.includes('users.email')) {
        console.log('Email duplicate detected');
    } else {
        console.log('Other duplicate detected');
    }
} else {
    console.log('Not a constraint error or message not matching expected patterns');
}