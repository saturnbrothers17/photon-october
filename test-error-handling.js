// Test error handling
const error = {
  code: 'SQLITE_CONSTRAINT',
  rawCode: undefined,
  [Symbol('cause')]: {
    code: 'SQLITE_CONSTRAINT',
    proto: {
      message: 'SQLite error: UNIQUE constraint failed: users.email',
      code: 'SQLITE_CONSTRAINT'
    }
  }
};

console.log('Testing error handling...');
console.log('Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error)));

let errorMessageString = '';

// Get the error message from the appropriate location
// Check the main error object first
if (error.message) {
    errorMessageString = error.message;
}
// Check the cause property if it exists
else if (error.cause) {
    if (error.cause.message) {
        errorMessageString = error.cause.message;
    } else if (error.cause.proto && error.cause.proto.message) {
        errorMessageString = error.cause.proto.message;
    }
}
// Fallback to toString
else if (error.toString) {
    errorMessageString = error.toString();
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